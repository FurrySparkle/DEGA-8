import { defaultModel } from "./openai";
import { Parameters } from "./types";
import storage from "../../components/mockLocalStorage";
import { MODEL_PROVIDERS } from "./types";

export const defaultParameters: Parameters = {
    temperature: 0.5,
    topP: 0.8,
    model: defaultModel,
    endpoint: MODEL_PROVIDERS[defaultModel as keyof typeof MODEL_PROVIDERS].endpoint
};

export function loadParameters(id: string | null | undefined = null): Parameters {
    const model = storage.getItem('model') || defaultModel;
    const provider = MODEL_PROVIDERS[model as keyof typeof MODEL_PROVIDERS];
    const apiKey = storage.getItem(provider.keyName) || undefined;
    
    const key = id ? `parameters-${id}` : 'parameters';
    try {
        const raw = storage.getItem(key);
        if (raw) {
            const parameters = JSON.parse(raw) as Parameters;
            parameters.apiKey = apiKey;
            parameters.endpoint = provider.endpoint;
            return parameters;
        }
    } catch (e) { }
    return id ? loadParameters() : { 
        ...defaultParameters, 
        apiKey,
        endpoint: provider.endpoint 
    };
}

export function saveParameters(id: string, parameters: Parameters) {
    if (parameters) {
        const model = parameters.model || defaultModel;

        delete parameters.apiKey;
        storage.setItem(`parameters-${id}`, JSON.stringify(parameters));
        storage.setItem('parameters', JSON.stringify(parameters));
    }
}