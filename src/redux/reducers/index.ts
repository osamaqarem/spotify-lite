import { combineReducers } from "redux";
import authReducer from "./authReducer";
import { combineEpics } from "redux-observable";
import { getProfileEpic, refreshTokenEpic } from "../actions";
import loadingReducer from "./loadingReducer";
import { loadingEpic, doneEpic } from "../actions/loadingActions";

export const rootEpic = combineEpics(
  getProfileEpic,
  loadingEpic,
  doneEpic,
  refreshTokenEpic,
);

export default combineReducers({ authReducer, loadingReducer });
