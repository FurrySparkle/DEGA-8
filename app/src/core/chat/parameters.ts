import { defaultModel } from "./openai";
import { Parameters } from "./types";
import storage from "../../components/mockLocalStorage";
export const defaultParameters: Parameters = {
    temperature: 0.5,
    topP: 0.8,
    model: defaultModel
};

export function loadParameters(id: string | null | undefined = null): Parameters {
    const apiKey = storage.getItem('openai-api-key') || undefined;
    const key = id ? `parameters-${id}` : 'parameters';
    try {
        const raw = storage.getItem(key);
        if (raw) {
            const parameters = JSON.parse(raw) as Parameters;
            parameters.apiKey = apiKey;
            return parameters;
        }
    } catch (e) { }
    return id ? loadParameters() : { ...defaultParameters, apiKey };
}

export function saveParameters(id: string, parameters: Parameters) {
    if (parameters) {
        const apiKey = parameters.apiKey;
        delete parameters.apiKey;

        storage.setItem(`parameters-${id}`, JSON.stringify(parameters));
        storage.setItem('parameters', JSON.stringify(parameters));

        if (apiKey) {
            storage.setItem(`openai-api-key`, apiKey);
        }
    }
}