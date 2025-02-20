import Plugin from "../core/plugins";
import { PluginDescription } from "../core/plugins/plugin-description";
import { OpenAIMessage, Parameters } from "../core/chat/types";
import { maxTokensByModel } from "../core/chat/openai";
import { countTokens, runChatTrimmer } from "../core/tokenizer/wrapper";

export interface ContextTrimmerPluginOptions {
    maxTokens: number;
    maxMessages: number | null;
    preserveSystemPrompt: boolean;
    preserveFirstUserMessage: boolean;
}

export class ContextTrimmerPlugin extends Plugin<ContextTrimmerPluginOptions> {
    describe(): PluginDescription {
        return {
            id: "context-trimmer",
            name: "Message Context",
            options: [
                {
                    id: "maxTokens",
                    displayOnSettingsScreen: "chat",
                    defaultValue: 65000,
                    scope: "chat",
                    renderProps: (value, options, context) => ({
                        label: context.intl.formatMessage(
                            {
                                defaultMessage:
                                    "Include a maximum of {value} tokens", id: 'rq6lHK',
                            },
                            { value: value }
                        ),
                        type: "slider",
                        min: 512,
                        max:
                            maxTokensByModel[
                                options.getOption("parameters", "model")
                            ] || 128000,
                        step: 512,
                    }),
                    validate: (value, options) => {
                        const max =
                            maxTokensByModel[
                                options.getOption("parameters", "model")
                            ] || 2048;
                        return value < max;
                    },
                    displayInQuickSettings: {
                        name: "Max Tokens",
                        displayByDefault: false,
                        label: (value, options, context) =>
                            context.intl.formatMessage(
                                {
                                    defaultMessage: "Max tokens: {value}", id: '79mYop',
                                },
                                { value: value }
                            ),
                    },
                },
                // {
                //     id: 'maxMessages',
                //     displayOnSettingsScreen: "chat",
                //     defaultValue: null,
                //     scope: "chat",
                //     renderProps: (value) => ({
                //         label: `Include only the last ${value || 'N'} messages (leave blank for all)`,
                //         type: "number",
                //         min: 1,
                //         max: 10,
                //         step: 1,
                //     }),
                //     displayInQuickSettings: {
                //         name: "Max Messages",
                //         displayByDefault: false,
                //         label: value => `Include ${value ?? 'all'} messages`,
                //     },
                // },
                {
                    id: "preserveSystemPrompt",
                    displayOnSettingsScreen: "chat",
                    defaultValue: true,
                    scope: "chat",
                    renderProps: (value, options, context) => ({
                        label: context.intl.formatMessage({
                            defaultMessage:
                                "Try to always include the System Prompt", id: 'lxBBL0',
                        }),
                        type: "checkbox",
                    }),
                },
                {
                    id: "preserveFirstUserMessage",
                    displayOnSettingsScreen: "chat",
                    defaultValue: true,
                    scope: "chat",
                    renderProps: (value, options, context) => ({
                        label: context.intl.formatMessage({
                            defaultMessage:
                                "Try to always include your first message", id: 'cXeWz0',
                        }),
                        type: "checkbox",
                    }),
                },
            ],
        };
    }

    async preprocessModelInput(
        messages: OpenAIMessage[],
        parameters: Parameters
    ): Promise<{ messages: OpenAIMessage[]; parameters: Parameters }> {
        const before = await countTokens(messages);

        const options = this.options;

        const trimmed = await runChatTrimmer(messages, {
            maxTokens: options?.maxTokens ?? 65000,
            nMostRecentMessages: options?.maxMessages ?? undefined,
            preserveFirstUserMessage: options?.preserveFirstUserMessage || true,
            preserveSystemPrompt: options?.preserveSystemPrompt || true,
        });

        const after = await countTokens(trimmed);

        const diff = after - before;
        console.log(`[context trimmer] trimmed ${diff} tokens from context`);

        return {
            messages: trimmed,
            parameters,
        };
    }
}
