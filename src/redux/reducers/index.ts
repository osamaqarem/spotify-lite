import {combineReducers} from "redux";
import authReducer from "./authReducer";
import {combineEpics} from "redux-observable";
import {getProfile} from "../actions";

export const rootEpic = combineEpics(getProfile);

export default combineReducers({authReducer});
