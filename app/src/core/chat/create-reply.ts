import EventEmitter from "events";
import { createChatCompletion, createStreamingChatCompletion } from "./openai";
import { PluginContext } from "../plugins/plugin-context";
import { pluginRunner } from "../plugins/plugin-runner";
import { Chat, Message, OpenAIMessage, Parameters, getOpenAIMessageFromMessage } from "./types";
import { EventEmitterAsyncIterator } from "../utils/event-emitter-async-iterator";
import { YChat } from "./y-chat";
import { OptionsManager } from "../options";
import { P8Injector } from "../../components/DEGA-8/CartTemplater";

export class ReplyRequest extends EventEmitter {
    private mutatedMessages: OpenAIMessage[];
    private mutatedParameters: Parameters;
    private lastChunkReceivedAt: number = 0;
    private timer: any;
    private done: boolean = false;
    private content = '';
    private reasoningContent = '';
    private cancelSSE: any;

    constructor(private chat: Chat,
                private yChat: YChat,
                private messages: Message[],
                private replyID: string,
                private requestedParameters: Parameters,
                private pluginOptions: OptionsManager) {
        super();
        this.mutatedMessages = [...messages];
        this.mutatedMessages = messages.map(m => getOpenAIMessageFromMessage(m));
        this.mutatedParameters = { ...requestedParameters };
        delete this.mutatedParameters.apiKey;
    }

    pluginContext = (pluginID: string) => ({
        getOptions: () => {
            return this.pluginOptions.getAllOptions(pluginID, this.chat.id);
        },

        getCurrentChat: () => {
            return this.chat;
        },

        createChatCompletion: async (messages: OpenAIMessage[], _parameters: Parameters) => {
            return await createChatCompletion(messages, {
                ..._parameters,
                apiKey: this.requestedParameters.apiKey,
            });
        },

        setChatTitle: async (title: string) => {
            this.yChat.title = title;
        },
    } as PluginContext);

    private scheduleTimeout() {
        this.lastChunkReceivedAt = Date.now();

        clearInterval(this.timer);

        this.timer = setInterval(() => {
            const sinceLastChunk = Date.now() - this.lastChunkReceivedAt;
            if (sinceLastChunk > 60000 && !this.done) {
                this.onError('Connection timed out after 60 seconds of inactivity');
            }
        }, 5000);
    }

    public async execute() {
        try {
            this.scheduleTimeout();

            await pluginRunner("preprocess-model-input", this.pluginContext, async plugin => {
                const output = await plugin.preprocessModelInput(this.mutatedMessages, this.mutatedParameters);
                this.mutatedMessages = output.messages;
                this.mutatedParameters = output.parameters;
                this.lastChunkReceivedAt = Date.now();
            });

            const { emitter, cancel } = await createStreamingChatCompletion(this.mutatedMessages, {
                ...this.mutatedParameters,
                apiKey: this.requestedParameters.apiKey,
            });
            this.cancelSSE = cancel;

            const eventIterator = new EventEmitterAsyncIterator<string>(emitter, ["data", "reasoning", "done", "error"]);

            for await (const event of eventIterator) {
                const { eventName, value } = event;
                this.lastChunkReceivedAt = Date.now();

                switch (eventName) {
                    case 'data':
                        await this.onData(value);
                        break;
                    case 'reasoning':
                        await this.onReasoning(value);
                        break;
                    case 'done':
                        await this.onDone();
                        break;
                    case 'error':
                        if (!this.content || !this.done) {
                            await this.onError(value);
                        }
                        break;
                }
            }
        } catch (e: any) {
            console.error(e);
            this.onError(e.message);
        }
    }

    public async onData(value: any) {
        if (this.done) {
            return;
        }

        this.lastChunkReceivedAt = Date.now();
        this.content = value;

        await this.updateMessageContent();
    }

    public async onReasoning(value: any) {
        if (this.done) {
            return;
        }

        this.lastChunkReceivedAt = Date.now();
        this.reasoningContent = value;

        await this.updateMessageContent();
    }

    private async updateMessageContent() {
        let formattedContent = '';
        
        // Only show reasoning section for deepseek-reasoner model
        if (this.requestedParameters.model === 'deepseek-reasoner' && this.reasoningContent) {
            formattedContent = `💭 Thinking Process:\n\`\`\`\n${this.reasoningContent}\n\`\`\`\n\n`;
        }
        
        formattedContent += this.content;

        await pluginRunner("postprocess-model-output", this.pluginContext, async plugin => {
            const output = await plugin.postprocessModelOutput({
                role: 'assistant',
                content: formattedContent,
            }, this.mutatedMessages, this.mutatedParameters, false);

            formattedContent = output.content;
        });

        this.yChat.setPendingMessageContent(this.replyID, formattedContent);
    }

    public async onDone() {
        if (this.done) {
            return;
        }
        clearInterval(this.timer);
        this.lastChunkReceivedAt = Date.now();
        this.done = true;
        this.emit('done');

        this.yChat.onMessageDone(this.replyID);

        let finalContent = '';
        if (this.requestedParameters.model === 'deepseek-reasoner' && this.reasoningContent) {
            finalContent = `💭 Thinking Process:\n\`\`\`\n${this.reasoningContent}\n\`\`\`\n\n`;
        }
        finalContent += this.content;

        await pluginRunner("postprocess-model-output", this.pluginContext, async plugin => {
            const output = await plugin.postprocessModelOutput({
                role: 'assistant',
                content: finalContent,
            }, this.mutatedMessages, this.mutatedParameters, true);

            finalContent = output.content;
        });

        this.yChat.setMessageContent(this.replyID, finalContent);
        //possible location for .p8 injection
        P8Injector(this.content.trim() || '');
        console.log("P8 Injector Fired! Data:" + this.content.trim() || '');
    }

    public async onError(error: string) {
        if (this.done) {
            return;
        }
        this.done = true;
        this.emit('done');
        clearInterval(this.timer);
        this.cancelSSE?.();

        this.content += `\n\nI'm sorry, I'm having trouble connecting to the Model Provider (${error || 'no response from the API'}). Please make sure you've entered your API key correctly and try again.`;
        this.content = this.content.trim();

        this.yChat.setMessageContent(this.replyID, this.content);
        this.yChat.onMessageDone(this.replyID);
    }

    public onCancel() {
        clearInterval(this.timer);
        this.done = true;
        this.yChat.onMessageDone(this.replyID);
        this.cancelSSE?.();
        this.emit('done');
    }

    // private setMessageContent(content: string) {
    //     const text = this.yChat.content.get(this.replyID);
    //     if (text && text.toString() !== content) {
    //         text?.delete(0, text.length);
    //         text?.insert(0, content);
    //     }
    // }
}