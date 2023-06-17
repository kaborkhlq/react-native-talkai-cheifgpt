import { combineReducers } from "redux";

import AuthReducer from './auth.reducer';
import OpenAIReducer from './openai.reducer';

export default combineReducers({
    AuthReducer,
    OpenAIReducer
})