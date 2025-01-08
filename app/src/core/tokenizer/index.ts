import { OpenAIMessage } from "../chat/types";
import { CoreBPE, RankMap } from "./bpe";
import ranks from './cl100k_base.json';


export type ProcessableInput = string | number | boolean | null | undefined;

const special_tokens: any = {
    "<|endoftext|>": 100257,
    "<|fim_prefix|>": 100258,
    "<|fim_middle|>": 100259,
    "<|fim_suffix|>": 100260,
    "<|endofprompt|>": 100276,
};

const special_tokens_map = new Map<string, number>();
for (const text of Object.keys(special_tokens)) {
    special_tokens_map.set(text, special_tokens[text]);
}

const pattern = /('s|'t|'re|'ve|'m|'ll|'d)|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}| ?[^\s\p{L}\p{N}]+[\r\n]*|\s*[\r\n]+|\s+(?!\S)|\s+/giu;

const tokenizer = new CoreBPE(RankMap.from(ranks), special_tokens_map, pattern);

const overheadTokens = {
    perMessage: 5,
    perPrompt: 2,
}

const tokenCache = new Map<string, number>();
export function processString(input: ProcessableInput): string {
    // Ensure input is actually a string
    if (input === null || input === undefined) {
        return '';
    }
    return String(input);
}
  
  
//   // If you're using string arrays
//   export function processArray(inputs: any[]): string[] {
 
//     return inputs.map(input => String(input));
//   }
export function countTokensForText(text: string) {
    if (typeof text !== 'string') {
        throw new Error('Input must be a string');
    }
    const cacheKey = text;
    if (tokenCache.has(cacheKey)) {
        return tokenCache.get(cacheKey)!;
    }
    let t1 = Date.now();
    const tokens = tokenizer.encodeOrdinary(text).length;
    tokenCache.set(cacheKey, tokens);
    return tokens;
}

export function countTokensForMessage(message: OpenAIMessage) {
    if (typeof message.content !== 'string') {
        message.content = processString(message.content);
    }
    return countTokensForText(message.content) + overheadTokens.perMessage;
}

export function countTokensForMessages(messages: OpenAIMessage[]) {
    
    let tokens = overheadTokens.perPrompt;
    for (const m of messages) {
        tokens += countTokensForMessage(m);
    }
    return tokens;
}

export function truncateText(text: string, tokens: number) {
    if (typeof text !== 'string') {
        text = processString(text);
    }
    const encoded = tokenizer.encodeOrdinary(text);
    const decoded = tokenizer.decodeBytes(encoded.slice(0, Math.max(0, tokens)));
    return new TextDecoder().decode(decoded);
}

export function truncateMessage(message: OpenAIMessage, tokens: number) {
    if (typeof message.content !== 'string') {
        message.content = processString(message.content);
    }
    

    const encoded = tokenizer.encodeOrdinary(message.content);
    const decoded = tokenizer.decodeBytes(encoded.slice(0, Math.max(0, tokens - overheadTokens.perMessage)));
    return {
        role: message.role,
        content: new TextDecoder().decode(decoded),
    };
}