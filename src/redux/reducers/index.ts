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
  searchForQueryEpic,
  browseActionLoadingEpic,
} from "../actions";
import { getPlayListByIdEpic } from "../actions/playlistActions";
import albumReducer from "./albumReducer";
import artistReducer from "./artistReducer";
import browseReducer from "./browseReducer";
import followRedcuer from "./followReducer";
import libraryReducer from "./libraryReducer";
import personalizationReducer from "./personalizationReducer";
import playlistReducer from "./playlistReducer";
import userReducer from "./userReducer";
import searchReducer from "./searchReducer";

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
  searchForQueryEpic,
  browseActionLoadingEpic,
);

// Redux persist
const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [
    "artistReducer",
    "browseReducer",
    "playlistReducer",
    "searchReducer",
  ],
};

// Persist browse reducer state, except genrePlaylists, genreDetails
const browseReducerPersistConfig = {
  key: "browseReducer",
  storage: AsyncStorage,
  blacklist: ["genrePlaylists", "genreDetails"],
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
  searchReducer,
});

export type RootStoreType = ReturnType<typeof combinedReducers>;

export default persistReducer(rootPersistConfig, combinedReducers);
