import { FormattedMessage } from "react-intl";
import Plugin from "../core/plugins";
import { PluginDescription } from "../core/plugins/plugin-description";
import { OpenAIMessage, Parameters } from "../core/chat/types";
import storage from "../components/mockLocalStorage";
export const defaultSoundPrompt = `
0007000012110000001e140000301915000000121500f150111501515017150171501b15021150000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000100001d65018150166501d5501c650215501f55023550236502365000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000200000a35005150116501365014640196201e60000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000300000875018750077501d75007750227500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00040000196501f150166501c1500c150131500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000300000000007150000001515000000061500000015150000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00030000072500d640072500a65006260056300320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
`.trim();

export interface SystemSoundPluginOptions {
    systemSound: string;
}

export class SystemSoundPlugin extends Plugin<SystemSoundPluginOptions> {
    describe(): PluginDescription {
        return {
            id: "sound-system",
            name: "Sound system",
            options: [
                {
                    id:  "systemSound",
                    defaultValue: defaultSoundPrompt,
                    displayOnSettingsScreen: "pico",
                    resettable: true,
                    scope: "browser",
                    renderProps: {
                        type: "textarea",
                        description: <p>
                            <FormattedMessage
                                id="m0pUoC"
                                defaultMessage={`The Sound System is an exposure of the pico code after export. If you want to enter your own music and sounds made in your own pico editor, you can export the .p8 file and scroll to the bottom of the file in a text editor. Collect the number block under __sfx__ and insert that here. Those numbers will be converted into the player on the next load of the PicoPlayer.`}
                                values={{ code: v => <code>{v}</code> }} />
                        </p>,
                    },
                    displayInQuickSettings: {
                        name: "Sound system",
                        displayByDefault: true,
                        label: (value, options, context) => {
                            return context.intl.formatMessage({
                                id: 'cKmoi0',
                                defaultMessage: "Customize system sound"
                            });
                        },
                    },
                },
            ],
        };
    }

    initialize(): Promise<void> {
        return new Promise((resolve) => {
            
    
            storage.setItem('SoundData', (this.options?.systemSound || defaultSoundPrompt));
    
            // Explicitly resolve the promise.
            resolve();
        });
    }

    async preprocessModelInput(messages: OpenAIMessage[], parameters: Parameters): Promise<{ messages: OpenAIMessage[]; parameters: Parameters; }> {
       
       

        storage.setItem('SoundData', (this.options?.systemSound || defaultSoundPrompt));

        return {
            messages,
            parameters,
        };
    }

   
    
}


//TODO: copy sfx template above for gfx template