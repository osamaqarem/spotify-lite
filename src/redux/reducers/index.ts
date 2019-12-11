import { combineEpics } from "redux-observable";
import {
  getProfileEpic,
  loadingEpic,
  doneEpic,
  refreshTokenEpic,
  getRecentlyPlayedEpic,
  getMultipleAlbumsEpic,
  getAllFeaturedPlaylistsEpic,
  getCurrentUserTopArtistsEpic,
  getCurrentUserPlaylistsEpic,
  getCurrentUserSavedTracksEpic,
  getCurrentUserSavedArtistsEpic,
  getCurrentUserSavedAlbumsEpic,
  getAllCategoriesForCountryEpic,
  getAlbumByIdEpic,
  getPlayListByIdEpic,
} from "../actions";
import { combineReducers } from "redux";
import userReducer from "./userReducer";
import loadingReducer from "./loadingReducer";
import albumReducer from "./albumReducer";
import libraryReducer from "./libraryReducer";
import browseReducer from "./browseReducer";
import personalizationReducer from "./personalizationReducer";
import followRedcuer from "./followRedcuer";

export const rootEpic = combineEpics(
  getProfileEpic,
  loadingEpic,
  doneEpic,
  refreshTokenEpic,
  getRecentlyPlayedEpic,
  getAlbumByIdEpic,
  getMultipleAlbumsEpic,
  getAllFeaturedPlaylistsEpic,
  getCurrentUserTopArtistsEpic,
  getCurrentUserPlaylistsEpic,
  getCurrentUserSavedTracksEpic,
  getCurrentUserSavedAlbumsEpic,
  getCurrentUserSavedArtistsEpic,
  getAllCategoriesForCountryEpic,
  getPlayListByIdEpic,
);

export default combineReducers({
  userReducer,
  loadingReducer,
  albumReducer,
  libraryReducer,
  browseReducer,
  personalizationReducer,
  followRedcuer,
});
