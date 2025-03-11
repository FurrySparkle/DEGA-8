import EventEmitter from "events";
import { Configuration, OpenAIApi } from "openai";
import SSE from "../utils/sse";
import { OpenAIMessage, Parameters } from "./types";
import { backend } from "../backend";
import { P8Injector } from "../../components/DEGA-8/CartTemplater";
import { MODEL_PROVIDERS } from "./types";

export const defaultModel = Object.keys(MODEL_PROVIDERS)[0];

export function isProxySupported() {
    return !!backend.current?.services?.includes('openai');
}

function shouldUseProxy(apiKey: string | undefined | null) {
    return !apiKey && isProxySupported();
}

function getEndpoint(parameters: Parameters, proxied = false) {
    if (proxied) {
        return '/chatapi/proxies/openai';
    }
    return parameters.endpoint || MODEL_PROVIDERS[parameters.model].endpoint;
}

export interface OpenAIResponseChunk {
    id?: string;
    done: boolean;
    choices?: {
        delta: {
            content: string;
            reasoning_content?: string;
        };
        index: number;
        finish_reason: string | null;
    }[];
    model?: string;
}

function parseResponseChunk(buffer: any): OpenAIResponseChunk {
    // If buffer is undefined/null, return empty response
    if (!buffer) {
        return {
            done: false,
            choices: [{
                delta: { content: '' },
                index: 0,
                finish_reason: null
            }]
        };
    }

    // Ensure we have a string to work with
    const rawData = typeof buffer === 'string' ? buffer : String(buffer);

    // Check for [DONE] message
    if (rawData.includes('[DONE]')) {
        return { done: true };
    }

    try {
        // For SSE data format, we need to handle the 'data: ' prefix
        let jsonStr = rawData;
        if (rawData.startsWith('data: ')) {
            jsonStr = rawData.slice(6); // Remove 'data: ' prefix
        }
        jsonStr = jsonStr.trim();

        if (!jsonStr) {
            return {
                done: false,
                choices: [{
                    delta: { content: '' },
                    index: 0,
                    finish_reason: null
                }]
            };
        }

        const parsed = JSON.parse(jsonStr);
        
        // Handle DeepSeek's response format
        return {
            id: parsed.id,
            done: false,
            choices: parsed.choices?.map((choice: any) => ({
                delta: {
                    content: choice.delta?.content || '',
                    reasoning_content: choice.delta?.reasoning_content
                },
                index: choice.index || 0,
                finish_reason: choice.finish_reason
            })) || [],
            model: parsed.model
        };
    } catch (e) {
        console.error('Failed to parse chunk:', e, 'Raw data:', rawData);
        return {
            done: false,
            choices: [{
                delta: { content: '' },
                index: 0,
                finish_reason: null
            }]
        };
    }
}

export async function createChatCompletion(messages: OpenAIMessage[], parameters: Parameters): Promise<string> {
    const proxied = shouldUseProxy(parameters.apiKey);
    const endpoint = getEndpoint(parameters, proxied);

    if (!proxied && !parameters.apiKey) {
        throw new Error('No API key provided');
    }

    const response = await fetch(endpoint + '/v1/chat/completions', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': !proxied ? `Bearer ${parameters.apiKey}` : '',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "model": parameters.model,
            "messages": messages,
            "temperature": parameters.temperature,
            "top_p": parameters.topP,
        }),
    });

    const data = await response.json();
   
    return data.choices[0].message?.content?.trim() || '';
}

export async function createStreamingChatCompletion(messages: OpenAIMessage[], parameters: Parameters) {
    const emitter = new EventEmitter();

    const proxied = shouldUseProxy(parameters.apiKey);
    const endpoint = getEndpoint(parameters, proxied);

    if (!proxied && !parameters.apiKey) {
        throw new Error('No API key provided');
    }

    const payload = {
        model: parameters.model,
        messages: messages,
        temperature: parameters.temperature,
        top_p: parameters.topP,
        stream: true,
        max_tokens: parameters.maxTokens,
        presence_penalty: parameters.presencePenalty,
        frequency_penalty: parameters.frequencyPenalty
    };

    const eventSource = new SSE(endpoint + '/v1/chat/completions', {
        method: "POST",
        headers: {
            'Accept': 'text/event-stream',
            'Authorization': !proxied ? `Bearer ${parameters.apiKey}` : '',
            'Content-Type': 'application/json',
        },
        payload: JSON.stringify(payload),
    }) as SSE;

    let contents = '';
    let reasoningContents = '';

    eventSource.addEventListener('error', (event: any) => {
        if (!contents) {
            let error = event.data;
            try {
                error = JSON.parse(error).error.message;
            } catch (e) {
                // If parsing fails, use the raw error message
                error = error || 'Unknown error occurred';
            }
            emitter.emit('error', error);
        }
    });

    eventSource.addEventListener('message', async (event: any) => {
        try {
            const chunk = parseResponseChunk(event.data);
            
            if (chunk.done) {
                emitter.emit('done');
                return;
            }

            if (chunk.choices && chunk.choices.length > 0) {
                const choice = chunk.choices[0];
                const content = choice?.delta?.content || '';
                const reasoningContent = choice?.delta?.reasoning_content || '';

                if (content || reasoningContent) {
                    if (content) contents += content;
                    if (reasoningContent) {
                        reasoningContents += reasoningContent;
                    }
                    emitter.emit('data', contents);
                    emitter.emit('reasoning', reasoningContents);
                }
            }
        } catch (e) {
            console.error('Error processing message:', e);
            emitter.emit('error', 'Error processing message');
        }
    });

    eventSource.stream();

    return {
        emitter,
        cancel: () => {
            P8Injector(contents?.trim() || '');
            console.log("P8 Injector Fired! Data:" + contents.trim() || '');
            eventSource.close();
        }
    };
}

export const maxTokensByModel = {
    //"o3-preview": 16048,
    "gpt-4o": 127500,
    "deepseek-reasoner": 64000,
}