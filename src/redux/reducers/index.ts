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
  getPlayListCoverByIdEpic,
  getCurrentUserPlaylistsEpic,
  getCurrentUserSavedTracksEpic,
  getCurrentUserSavedArtistsEpic,
  getCurrentUserSavedAlbumsEpic,
  getAllCategoriesForCountryEpic,
} from "../actions";
import { combineReducers } from "redux";
import userReducer, { UserReducerType } from "./userReducer";
import loadingReducer, { LoadingReducerType } from "./loadingReducer";
import albumReducer, { AlbumReducerType } from "./albumReducer";
import libraryReducer, { LibraryReducerType } from "./libraryReducer";
import browseReducer, { BorwserReducerType } from "./browseReducer";
import personalizationReducer, {
  PersonalizationReducerType,
} from "./personalizationReducer";
import followRedcuer, { FollowReducerType } from "./followRedcuer";

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
  getCurrentUserSavedTracksEpic,
  getCurrentUserSavedAlbumsEpic,
  getCurrentUserSavedArtistsEpic,
  getAllCategoriesForCountryEpic,
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

export type ReduxStoreType = {
  userReducer: UserReducerType;
  loadingReducer: LoadingReducerType;
  albumReducer: AlbumReducerType;
  libraryReducer: LibraryReducerType;
  browseReducer: BorwserReducerType;
  personalizationReducer: PersonalizationReducerType;
  followRedcuer: FollowReducerType;
};
