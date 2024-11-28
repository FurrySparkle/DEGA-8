import Plugin from "../core/plugins";

import { SystemPromptPlugin } from "./system-prompt";
import { TitlePlugin } from "./titles";
import { ContextTrimmerPlugin } from "./trimmer";

import ElevenLabsPlugin from "../tts-plugins/elevenlabs";
import WebSpeechPlugin from "../tts-plugins/web-speech";
import { SystemSoundPlugin } from "./picoPlayerSettings";

export const registeredPlugins: Array<typeof Plugin<any>> = [
    SystemPromptPlugin,
    SystemSoundPlugin,
    ContextTrimmerPlugin,
    TitlePlugin,
    WebSpeechPlugin,
    ElevenLabsPlugin,
];