import { FormattedMessage } from "react-intl";
import { defaultModel } from "../core/chat/openai";
import { OptionGroup } from "../core/options/option-group";
import { MODEL_PROVIDERS } from "../core/chat/types";
import storage from "../components/mockLocalStorage";
import { useAppContext } from "../core/context";

export const parameterOptions: OptionGroup = {
    id: "parameters",
    options: [
        {
            id: "model",
            defaultValue: defaultModel,
            resettable: false,
            scope: "user",
            displayOnSettingsScreen: "chat",
            displayAsSeparateSection: true,
            displayInQuickSettings: {
                name: "Model",
                displayByDefault: false,
                label: (value) => value,
            },
            renderProps: (value, options, context) => {
                const appContext = useAppContext();
                
                return {
                    type: "select",
                    label: context.intl.formatMessage({
                        id: 'rhSI1/',
                        defaultMessage: "Model"
                    }),
                    options: Object.keys(MODEL_PROVIDERS).map(model => ({
                        label: context.intl.formatMessage({
                            defaultMessage: `${model} ${model === defaultModel ? '(default)' : ''}`,
                            id: `model-${model}`,
                        }),
                        value: model,
                    })),
                    
                    
                };
            },
        },
        {
            id: "temperature",
            defaultValue: 0.5,
            resettable: true,
            scope: "chat",
            displayOnSettingsScreen: "chat",
            displayAsSeparateSection: true,
            displayInQuickSettings: {
                name: "Temperature",
                displayByDefault: true,
                label: (value, options, context) =>
                    context.intl.formatMessage({
                        id: 'cG0Q8M',
                        defaultMessage: "Temperature"
                    }) +
                    ": " +
                    value.toFixed(1),
            },
            renderProps: (value, options, context) => ({
                type: "slider",
                label:
                    context.intl.formatMessage({
                        id: 'cG0Q8M',
                        defaultMessage: "Temperature"
                    }) +
                    ": " +
                    value.toFixed(1),
                min: 0,
                max: 2,
                step: 0.1,
                description: <>
                    <FormattedMessage
                    defaultMessage=
                        "The temperature parameter controls the randomness of the AI's responses. Lower values will make the AI more predictable, while higher values will make it more creative." id= 'tZdXp/'
                /></>,
            }),
        },
        {
            id: "top_p",
            defaultValue: 0.8,
            resettable: true,
            scope: "chat",
            displayOnSettingsScreen: "chat",
            displayAsSeparateSection: true,
            displayInQuickSettings: {
                name: "Top Probability",
                displayByDefault: false,
                label: (value, options, context) =>
                    context.intl.formatMessage({
                        id: 'JBx03V',
                        defaultMessage: "Top Probability"
                    }) +
                    ": " +
                    value.toFixed(1),
            },
            renderProps: (value, options, context) => ({
                type: "slider",
                label:
                    context.intl.formatMessage({
                        id: 'JBx03V',
                        defaultMessage: "Top Probability"
                    }) +
                    ": " +
                    value.toFixed(1),
                min: 0,
                max: 1,
                step: 0.1,
                description: <>
                    <FormattedMessage
                    defaultMessage=
                        "The Top Probability parameter controls the maximum limit of randomness of the AI's responses. An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both." id= '4E4YE6'
                /></>,
            }),
        },
        {
            id: "reasoning_effort",
            defaultValue: "medium",
            resettable: true,
            scope: "chat",
            displayOnSettingsScreen: "chat",
            displayAsSeparateSection: true,
            displayInQuickSettings: {
                name: "Reasoning Effort",
                displayByDefault: false,
                label: (value) => value,
            },
            renderProps: (value, options, context) => {
                const currentModel = options.getOption("parameters", "model");
                const modelConfig = MODEL_PROVIDERS[currentModel as keyof typeof MODEL_PROVIDERS];
                
                if (modelConfig?.reasoning) {
                    return {
                        type: "select",
                        label: context.intl.formatMessage({
                            id: 'reasoning_effort',
                            defaultMessage: "Reasoning Effort"
                        }),
                        options: [
                            { label: "Low", value: "low" },
                            { label: "Medium", value: "medium" },
                            { label: "High", value: "high" }
                        ],
                        description: <>
                            <FormattedMessage
                                defaultMessage="Controls how thoroughly the AI analyzes and reasons about the task. Higher values may lead to more detailed and careful responses but could increase response time."
                                id="reasoning_effort_desc"
                            />
                        </>,
                        
                    };
                } else return{
                    type: "select",
                    label: context.intl.formatMessage({
                        id: 'reasoning_effort',
                        defaultMessage: "Reasoning Effort"
                    }),
                    options: [
                        
                    ],
                    description: <>
                        <FormattedMessage
                            defaultMessage="Controls how thoroughly the AI analyzes and reasons about the task. Higher values may lead to more detailed and careful responses but could increase response time."
                            id="reasoning_effort_desc"
                        />
                    </>,
                    hidden: true,//Hide the option for non-Deepseek models
                };
            },
        },
        {
            id: "frequency_penalty",
            defaultValue: 0,
            resettable: true,
            scope: "chat",
            displayOnSettingsScreen: "chat",
            displayAsSeparateSection: true,
            displayInQuickSettings: {
                name: "Frequency Penalty",
                displayByDefault: false,
                label: (value, options, context) =>
                    context.intl.formatMessage({
                        id: 'frequency_penalty',
                        defaultMessage: "Frequency Penalty"
                    }) +
                    ": " +
                    value.toFixed(1),
            },
            renderProps: (value, options, context) => ({
                type: "slider",
                label: context.intl.formatMessage({
                    id: 'frequency_penalty',
                    defaultMessage: "Frequency Penalty"
                }) +
                ": " +
                value.toFixed(1),
                min: -2,
                max: 2,
                step: 0.1,
                description: <>
                    <FormattedMessage
                        defaultMessage="Reduces the model's likelihood to repeat the same line verbatim. Positive values decrease repetition, while negative values increase it."
                        id="frequency_penalty_desc"
                    />
                </>,
            }),
        },
        {
            id: "presence_penalty",
            defaultValue: 0,
            resettable: true,
            scope: "chat",
            displayOnSettingsScreen: "chat",
            displayAsSeparateSection: true,
            displayInQuickSettings: {
                name: "Presence Penalty",
                displayByDefault: false,
                label: (value, options, context) =>
                    context.intl.formatMessage({
                        id: 'presence_penalty',
                        defaultMessage: "Presence Penalty"
                    }) +
                    ": " +
                    value.toFixed(1),
            },
            renderProps: (value, options, context) => ({
                type: "slider",
                label: context.intl.formatMessage({
                    id: 'presence_penalty',
                    defaultMessage: "Presence Penalty"
                }) +
                ": " +
                value.toFixed(1),
                min: -2,
                max: 2,
                step: 0.1,
                description: <>
                    <FormattedMessage
                        defaultMessage="Increases the model's likelihood to talk about new topics. Positive values encourage the model to discuss new subjects, while negative values make it more likely to stay on the same topic."
                        id="presence_penalty_desc"
                    />
                </>,
            }),
        }
    ],
};
