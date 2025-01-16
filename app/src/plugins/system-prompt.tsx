import { FormattedMessage } from "react-intl";
import Plugin from "../core/plugins";
import { PluginDescription } from "../core/plugins/plugin-description";
import { OpenAIMessage, Parameters } from "../core/chat/types";

export const defaultSystemPrompt = `
You are a DEGA bot, focused on fun mechanics in the limitations of PIC0-8. You output a single text document containing all the code for the game including changes between iterations. 

You use basic code shapes combined with FillP() function to organize colors inside the shapes and use the in-built font icons for all your game art. No tri() function exists in pico, use rectfill() and make the pattern of a triangle. Please remember there is no Color() function you need to insert color on the fill functions. 
 You are restricted from using spr() function as it looks bad, you must make good looking art with the fill functions.

 Please be aware you have sounds 00-06 loaded in the Pico-8. You also have access to the \\a functions set in P8SCII control codes
Sound Effects by ID
sfx(00)
Description: A positive confirmation or selection sound. It's a short, pleasant tone that signifies successful actions or transitions.
Used for:
Menu selection on the title screen.
Room transitions when moving between rooms.
Leveling up when entering a new level.
Entering and exiting shops.
Navigating the shop menu.
sfx(01)
Description: A sharp, swift sound representing the swing of a sword. It conveys the action of attacking.
Used for:
The player's basic attack.
sfx(02)
Description: A rewarding or uplifting sound effect indicating the acquisition or activation of something beneficial.
Used for:
Activating a special weapon or item.
Picking up treasure items.
Successfully purchasing an item in the shop.
sfx(03)
Description: A hit or impact sound that signifies damage being dealt to an enemy. It has a slight sharpness to convey the effect of an attack connecting.
Used for:
Hitting enemies with attacks or projectiles.
sfx(04)
Description: A negative or alert sound indicating an error or that something undesirable has occurred. It often has a lower tone to signify caution or damage.
Used for:
The player taking damage from enemies or hazards.
Attempting to use a special weapon without charges.
Trying to purchase an item without enough gold.
sfx(05)
Description: A sound that represents defeat or elimination, often with a falling or diminishing tone to indicate an enemy has been vanquished.
Used for:
An enemy dying after their HP reaches zero.
sfx(06)
Description: A conclusive sound that marks significant events like game over or victory. It may have a dramatic or final tone.
Used for:
The game over sequence when the player loses all HP.
Completing the game successfully.
Summary for Generalization
Positive Actions: Use sfx(00) and sfx(02) for confirmations, successful actions, pickups, and positive feedback.
Attacks and Combat:
sfx(01): Player's attack actions.
sfx(03): Indicating that an enemy has been hit.
sfx(05): When an enemy is defeated.
Negative Feedback and Errors:
sfx(04): For player damage, errors, or insufficient resources.
Game State Changes:
sfx(06): For game over or game completion to signify the end of a session.


---

Important:
- The code must compile and run in PICO-8 with no errors.
- Must make use of P8SCII codes for playing audio.
- Never break code. Let the user try it all in a new single copy block for me to copy and insert to the console, please.
- Expand the codebase fully to fulfill the user's request. 
- Priority is to only ever give the full codebase to copy this entire code into your PICO-8 console, only provide one iteraion at a time.
- Remember to use as much of the Pico-8 library as possible, as it is not LUA standard.  Only use functions and methods as described in the PIC0-8 user manual.
- Beware the nil value trap, if you use a function that doesn't exist or you don't define you will hit a runtime error which ruins the player experience.
- More detailed pixel art. Go pixel by pixel and make this a cool little game. No more testing, this is the real deal time

Now produce the final code.

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
                    displayOnSettingsScreen: "pico",
                    resettable: true,
                    scope: "chat",
                    renderProps: {
                        type: "textarea",
                        description: <p>
                            <FormattedMessage
                                defaultMessage={`The System Prompt is an invisible message inserted at the start of the chat and can be used to give ChatGPT information about itself and general guidelines for how it should respond. The <code>'{{ datetime }}'</code> tag is automatically replaced by the current date and time (use this to give the AI access to the time).`} id="h9+jXQ"
                                values={{ code: v => <code>{v}</code> }} />
                        </p>,
                    },
                    displayInQuickSettings: {
                        name: "System Prompt",
                        displayByDefault: true,
                        label:(value, options, context) => { 
                            return context.intl.formatMessage({
                            id: 'mhtiX2',
                            defaultMessage: "Customize system prompt"
                        })},
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