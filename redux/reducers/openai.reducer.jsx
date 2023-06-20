import KEYS from "../keys";

const initialState = {
    IS_REQUEST: false,
    IS_SUCCESS: false,
    IS_FAILURE: false,

    openAIChatMsg: '',
    openAIWriterMsg: '',
    openAIPromptImages: [],

    messages: ""
}

export default function reducer (state = initialState, action) {
    switch(action.type) {
        case KEYS.OpenAIChat_REQUEST:
            return { ...state, IS_REQUEST: true, IS_SUCCESS: false, IS_FAILURE: false }
        case KEYS.OpenAIChat_SUCCESS:
            return { IS_REQUEST: false, IS_SUCCESS: true, IS_FAILURE: false, openAIChatMsg: action.payload, messages: action.config + '\n' + action.payload }
        case KEYS.OpenAIChat_FAILURE:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: false, IS_FAILURE: true }
        case KEYS.OpenAI_NEW_CHAT:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: false, IS_FAILURE: false, messages: "" }
    
        case KEYS.OpenAIWriter_REQUEST:
            return { ...state, IS_REQUEST: true, IS_SUCCESS: false, IS_FAILURE: false }
        case KEYS.OpenAIWriter_SUCCESS:
            return { IS_REQUEST: false, IS_SUCCESS: true, IS_FAILURE: false, openAIWriterMsg: action.payload }
        case KEYS.OpenAIWriter_FAILURE:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: false, IS_FAILURE: true, }

        case KEYS.OpenAIPrompt_REQUEST:
            return { ...state, IS_REQUEST: true, IS_SUCCESS: false, IS_FAILURE: false }
        case KEYS.OpenAIPrompt_SUCCESS:
            return { IS_REQUEST: false, IS_SUCCESS: true, IS_FAILURE: false, openAIPromptImages: action.payload }
        case KEYS.OpenAIPrompt_FAILURE:
            return { ...state, IS_REQUEST: false, IS_SUCCESS: false, IS_FAILURE: true, }
        default: 
            return state;
    }
}