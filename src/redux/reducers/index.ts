import AsyncStorage from "@react-native-community/async-storage";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import { persistReducer } from "redux-persist";
import {
  getAlbumByIdEpic,
  getAllCategoriesForCountryEpic,
  getAllFeaturedPlaylistsEpic,
  getCategoryByIdEpic,
  getCurrentUserPlaylistsEpic,
  getCurrentUserSavedAlbumsEpic,
  getCurrentUserSavedArtistsEpic,
  getCurrentUserSavedTracksEpic,
  getCurrentUserTopArtistsEpic,
  getMultipleAlbumsEpic,
  getProfileEpic,
  getRecentlyPlayedTracksEpic,
  restartActionsEpic,
} from "../actions";
import { getPlayListByIdEpic } from "../actions/playlistActions";
import albumReducer from "./albumReducer";
import artistReducer from "./artistReducer";
import browseReducer from "./browseReducer";
import followRedcuer from "./followReducer";
import libraryReducer from "./libraryReducer";
import personalizationReducer from "./personalizationReducer";
import playlistReducer from "./playlistReducer";
import themeReducer from "./themeReducer";
import userReducer from "./userReducer";

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
  getCategoryByIdEpic,
);

// Redux persist
const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [
    "artistReducer",
    "themeReducer",
    "browseReducer",
    "playlistReducer",
  ],
};

// Persist browse reducer state, except genrePlaylists
const browseReducerPersistConfig = {
  key: "browseReducer",
  storage: AsyncStorage,
  blacklist: ["genrePlaylists"],
};

const persistedBrowseReducer = persistReducer(
  browseReducerPersistConfig,
  browseReducer,
);

// Persist playlist reducer state, except playlistDetails
const playlistReducerPersistConfig = {
  key: "playlistReducer",
  storage: AsyncStorage,
  blacklist: ["playlistDetails"],
};

const persistedPlaylistReducer = persistReducer(
  playlistReducerPersistConfig,
  playlistReducer,
);

const combinedReducers = combineReducers({
  userReducer,
  albumReducer,
  libraryReducer,
  browseReducer: persistedBrowseReducer,
  personalizationReducer,
  followRedcuer,
  playlistReducer: persistedPlaylistReducer,
  artistReducer,
  themeReducer,
});

export const persistedReducer = persistReducer(
  rootPersistConfig,
  combinedReducers,
);

export type RootStoreType = ReturnType<typeof combinedReducers>;
