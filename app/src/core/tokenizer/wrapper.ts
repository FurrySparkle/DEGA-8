import { OpenAIMessage } from "../chat/types";
import type { ChatHistoryTrimmerOptions } from "./chat-history-trimmer";
// @ts-ignore
import{runChatTrimmers, countTokensForMessages} from './worker';



// let worker: any;

// async function getWorker() {
//     if (!worker) {
//         worker = new Worker(await tokenizer);
//     }
//     return worker;
// }

export  function runChatTrimmer(messages: OpenAIMessage[], options: ChatHistoryTrimmerOptions) {
    //const worker = await getWorker();
    return runChatTrimmers(messages, options);
}

export async function countTokens(messages: OpenAIMessage[]) {
    //const worker = await getWorker();
    return countTokensForMessages(messages);
}

// preload the worker
// getWorker().then(w => {
//     (window as any).worker = w;
// })