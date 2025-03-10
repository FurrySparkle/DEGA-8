import { FormattedMessage } from "react-intl";
import { OptionGroup } from "../core/options/option-group";
import FileUploadSingle from "../components/FileUpload";
import { MODEL_PROVIDERS } from "../core/chat/types";
import storage from "../components/mockLocalStorage";
import { useEffect } from "react";
import React from "react";

// Helper to get provider info text
const getProviderInfo = (model: string) => {
    switch (model) {
        case 'deepseek-reasoner':
            return {
                keyLink: "https://platform.deepseek.com/api-keys",
                keyLinkText: "Find your DeepSeek API key here.",
                costLink: "https://deepseek.com/pricing",
                costText: "Be aware that DeepSeek's APIs have associated cost."
            };
        case 'o3-mini':
            return {
                keyLink: "https://platform.openai.com/account/api-keys",
                keyLinkText: "Find your OpenAI API key here.",
                costLink: "https://www.openaccessgpt.org/what-is-the-cost",
                costText: "Be aware that OpenAI's APIs have associated cost."
            };
        default:
            return {
                keyLink: "https://platform.openai.com/account/api-keys",
                keyLinkText: "Find your OpenAI API key here.",
                costLink: "https://www.openaccessgpt.org/what-is-the-cost",
                costText: "Be aware that OpenAI's APIs have associated cost."
            };
    }
};


export const openAIOptions: OptionGroup = {
    id: 'openai',
    options: [
        { id: 'PicoDat',
            defaultValue: false,
            displayOnSettingsScreen: "user",
            displayAsSeparateSection: true,
            renderProps: (value, options, context) => ({  
                type: "checkbox",
                label: context.intl.formatMessage({
                    id: '/Z/Ow+',
                    defaultMessage: "Your Pico-8 Dat File"
                }),
                placeholder: "Upload your Pico.dat file",
                description: <>
                    <p>
                        <a href="https://www.lexaloffle.com/dl/docs/pico-8_manual.html#Getting_Started" target="_blank" rel="noopener noreferrer">
                            <FormattedMessage id="lbu8Rg" defaultMessage="Find the Pico-8 Manual here." description="Label for the link that takes the user to the page on the Pico website where they can find their Dat file." />
                        </a>
                    </p>
                    <FileUploadSingle></FileUploadSingle>
                
                    <p>
                        <FormattedMessage id="r+lcWP" defaultMessage="Your Dat File is stored only on this device and never transmitted to anyone." />
                    </p>
                    <p>
                    <FormattedMessage id="lDNh0C" defaultMessage="Be aware that you must legitimately own your Dat File. <a>Click here to get more infos.</a>"
                        values={{
                            a: (chunks: any) => <a href="https://www.lexaloffle.com/pico-8.php" target="_blank" rel="noopener noreferrer">{chunks}</a>
                        }} />
                    </p>
                </>,
            }), },
        {
            id: 'apiKey',
            defaultValue: "",
            displayOnSettingsScreen: "user",
            displayAsSeparateSection: true,
            resettable: true,
            renderProps: (value, options, context) => {
                const currentModel = options.getOption('parameters', 'model') || 'gpt-4o';
                const provider = MODEL_PROVIDERS[currentModel as keyof typeof MODEL_PROVIDERS];
                const providerInfo = getProviderInfo(currentModel);
                // Get the stored API key for this provider
                const storedKey = storage.getItem(provider.keyName);
                if (storedKey && !value) {
                    requestAnimationFrame(() => {
                        context.chat.options.setOption("openai", "apiKey", storedKey);
                    });
                }

                // Store the last provider to detect changes
                const lastProvider = React.useRef(provider.keyName);
                
                if (lastProvider.current !== provider.keyName) {

                    storage.setItem(lastProvider.current, value);
                    // Provider changed, reset the API key
                    lastProvider.current = provider.keyName;
                    requestAnimationFrame(() => {
                        context.chat.options.resetOptions("openai", "apiKey");
                    });
                }

                return {
                    type: "password",
                    label: context.intl.formatMessage({
                        id: 'c60o5M',
                        defaultMessage: `${currentModel} API Key`
                    }),
                    placeholder: provider.keyName,
                    description: <>
                        <p>
                            <a href={providerInfo.keyLink} target="_blank" rel="noopener noreferrer">
                                <FormattedMessage 
                                    id="zFt1cV" 
                                    defaultMessage={providerInfo.keyLinkText}
                                />
                            </a>
                        </p>
                        <p>
                            <FormattedMessage 
                                id="3T9nRn" 
                                defaultMessage="Your API key is stored only on this device and never transmitted to anyone except the model provider." 
                            />
                        </p>
                        <p>
                            <FormattedMessage 
                                id="hQPHf0" 
                                defaultMessage={`${providerInfo.costText} <a>Click here to get more infos.</a>`}
                                values={{
                                    a: (chunks: any) => (
                                        <a href={providerInfo.costLink} target="_blank" rel="noopener noreferrer">
                                            {chunks}
                                        </a>
                                    )
                                }} 
                            />
                        </p>
                    </>,
                };
            },
        },
    ],
}