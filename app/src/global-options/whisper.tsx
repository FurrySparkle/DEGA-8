import { OptionGroup } from "../core/options/option-group";
import { supportsSpeechRecognition } from "../core/speech-recognition-types";

export const whisperOptions: OptionGroup = {
    id: 'speech-recognition',
    name: "Microphone",
    hidden: !supportsSpeechRecognition,
    options: [
        {
            id: 'use-whisper',
            defaultValue: false,
            displayOnSettingsScreen: "speech",
            displayAsSeparateSection: false,
            renderProps: (value, options, context) => ({
                type: "checkbox",
                label: context.intl.formatMessage({
                    id: 'LNB3XB',
                    defaultMessage: "Use the OpenAI Whisper API for speech recognition"
                }),
                hidden: !supportsSpeechRecognition,
            }),
        },
        {
            id: 'show-microphone',
            defaultValue: true,
            displayOnSettingsScreen: "speech",
            displayAsSeparateSection: false,
            renderProps: (value, options, context) => ({
                type: "checkbox",
                label: context.intl.formatMessage({
                    id: 'UR9oCV',
                    defaultMessage: "Show microphone in message input"
                }),
            }),
        },
    ],
}