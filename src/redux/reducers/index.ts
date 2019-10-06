import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { combineEpics } from "redux-observable";
import { getProfileEpic } from "../actions";
import loadingReducer from "./loadingReducer";
import { loadingEpic, doneEpic } from "../actions/loadingActions";

export const rootEpic = combineEpics(getProfileEpic, loadingEpic, doneEpic);

export default combineReducers({ authReducer, loadingReducer });
