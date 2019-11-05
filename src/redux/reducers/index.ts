import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import {
  getProfileEpic,
  refreshTokenEpic,
  getAllFeaturedPlaylistsEpic,
  getCurrentUserTopArtistsEpic,
  getRecentlyPlayedEpic,
  getPlayListCoverByIdEpic,
  getCurrentUserPlaylistsEpic,
} from "../actions";
import { doneEpic, loadingEpic } from "../actions/loadingActions";
import { getMultipleAlbumsEpic } from "../actions/albumActions";
import albumReducer from "./albumReducer";
import authReducer from "./authReducer";
import loadingReducer from "./loadingReducer";
import libraryReducer from "./libraryReducer";

export const rootEpic = combineEpics(
  getProfileEpic,
  loadingEpic,
  doneEpic,
  refreshTokenEpic,
  getRecentlyPlayedEpic,
  getMultipleAlbumsEpic,
  getAllFeaturedPlaylistsEpic,
  getCurrentUserTopArtistsEpic,
  getPlayListCoverByIdEpic,
  getCurrentUserPlaylistsEpic,
);

export default combineReducers({
  authReducer,
  loadingReducer,
  albumReducer,
  libraryReducer,
});
