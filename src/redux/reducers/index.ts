import { combineEpics } from "redux-observable";
import {
  getProfileEpic,
  getRecentlyPlayedTracksEpic,
  getMultipleAlbumsEpic,
  getAllFeaturedPlaylistsEpic,
  getCurrentUserTopArtistsEpic,
  getCurrentUserPlaylistsEpic,
  getCurrentUserSavedTracksEpic,
  getCurrentUserSavedArtistsEpic,
  getCurrentUserSavedAlbumsEpic,
  getAllCategoriesForCountryEpic,
  getAlbumByIdEpic,
  restartActionsEpic,
} from "../actions";
import { combineReducers } from "redux";
import userReducer from "./userReducer";
import albumReducer from "./albumReducer";
import libraryReducer from "./libraryReducer";
import browseReducer from "./browseReducer";
import personalizationReducer from "./personalizationReducer";
import followRedcuer from "./followReducer";
import { getPlayListByIdEpic } from "../actions/playlistActions";
import playlistReducer from "./playlistReducer";
import artistReducer from "./artistReducer";
import themeReducer from "./themeReducer";

export const rootEpic = combineEpics(
  getProfileEpic,
  getRecentlyPlayedTracksEpic,
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
  restartActionsEpic,
);

export default combineReducers({
  userReducer,
  albumReducer,
  libraryReducer,
  browseReducer,
  personalizationReducer,
  followRedcuer,
  playlistReducer,
  artistReducer,
  themeReducer,
});
