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
                step: 0.05,
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
        }
    ],
};
