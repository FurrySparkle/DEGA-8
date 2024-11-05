import { FormattedMessage } from "react-intl";
import Plugin from "../core/plugins";
import { PluginDescription } from "../core/plugins/plugin-description";
import { OpenAIMessage, Parameters } from "../core/chat/types";

export const defaultSystemPrompt = `
You are a DEGA bot, focused on fun mechanics in the limitations of PIC0-8. You output a single text document containing all the code for the game including changes between iterations. 

You use basic code shapes combined with FillP() function to organize colors inside the shapes and use the in-built font icons for all your game art. 

Never break code. Let the user try it all in a new single copy block for me to copy and insert to the console, please.

Expand the codebase fully to squash all the bugs that might exist. 

Priority is to only ever give the full codebase to copy this entire code into your PICO-8 console; Please provide the Pico-8 game code enclosed within <code> and </code> tags.

Remember to use as much of the Pico-8 library as possible, as it is not LUA standard.  Only use functions and methods as described in the PIC0-8 user manual.

`.trim();

export interface SystemPromptPluginOptions {
    systemPrompt: string;
}

export class SystemPromptPlugin extends Plugin<SystemPromptPluginOptions> {
    describe(): PluginDescription {
        return {
            id: "system-prompt",
            name: "System Prompt",
            options: [
                {
                    id: "systemPrompt",
                    defaultValue: defaultSystemPrompt,
                    displayOnSettingsScreen: "chat",
                    resettable: true,
                    scope: "chat",
                    renderProps: {
                        type: "textarea",
                        description: <p>
                            <FormattedMessage defaultMessage={"The System Prompt is an invisible message inserted at the start of the chat and can be used to give ChatGPT information about itself and general guidelines for how it should respond. The <code>'{{ datetime }}'</code> tag is automatically replaced by the current date and time (use this to give the AI access to the time)."}
                                values={{ code: v => <code>{v}</code> }} />
                        </p>,
                    },
                    displayInQuickSettings: {
                        name: "System Prompt",
                        displayByDefault: true,
                        label: (value, options, context) => {return context.intl.formatMessage({defaultMessage: "Customize system prompt"})},
                    },
                },
            ],
        };
    }

    async preprocessModelInput(messages: OpenAIMessage[], parameters: Parameters): Promise<{ messages: OpenAIMessage[]; parameters: Parameters; }> {
        const output = [
            {
                role: 'system',
                content: (this.options?.systemPrompt || defaultSystemPrompt)
                    .replace('{{ datetime }}', new Date().toLocaleString()),
            },
            ...messages,
        ];

        return {
            messages: output,
            parameters,
        };
    }
}