import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import {
  getProfileEpic,
  refreshTokenEpic,
  getAllFeaturedPlaylistsEpic,
} from "../actions";
import { doneEpic, loadingEpic } from "../actions/loadingActions";
import { getRecentlyPlayedEpic } from "../actions/playlistActions";
import { getMultipleAlbumsEpic } from "../actions/albumActions";
import albumReducer from "./albumReducer";
import authReducer from "./authReducer";
import loadingReducer from "./loadingReducer";
import playlistReducer from "./playlistReducer";
import libraryReducer from "./libraryReducer";

export const rootEpic = combineEpics(
  getProfileEpic,
  loadingEpic,
  doneEpic,
  refreshTokenEpic,
  getRecentlyPlayedEpic,
  // getPlayListCoverByIdEpic,
  getMultipleAlbumsEpic,
  getAllFeaturedPlaylistsEpic,
);

export default combineReducers({
  authReducer,
  loadingReducer,
  albumReducer,
  playlistReducer,
  libraryReducer,
});
