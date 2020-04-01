import AsyncStorage from "@react-native-community/async-storage"
import { combineReducers } from "redux"
import { persistReducer } from "redux-persist"
import albumReducer from "./slices/albumSlice"
import artistReducer from "./slices/artistSlice"
import browseReducer from "./slices/browseSlice"
import followRedcuer from "./slices/followSlice"
import globalReducer from "./slices/globalSlice"
import libraryReducer from "./slices/librarySlice"
import personalizationReducer from "./slices/personalizationSlice"
import playlistReducer from "./slices/playlistSlice"
import searchReducer from "./slices/searchSlice"
import userReducer from "./slices/userSlice"

// Redux persist
const rootPersistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [
    "globalReducer",
    "browseReducer",
    "playlistReducer",
    "artistReducer",
    "searchReducer",
  ],
}

// globalReducer
const globalReducerPersistConfig = {
  key: "globalReducer",
  storage: AsyncStorage,
  blacklist: ["actionsToRestart"],
}

const persistedglobalReducer = persistReducer(
  globalReducerPersistConfig,
  globalReducer,
)

// browseReducer
const browseReducerPersistConfig = {
  key: "browseReducer",
  storage: AsyncStorage,
  blacklist: ["genrePlaylists", "genreDetails"],
}

const persistedBrowseReducer = persistReducer(
  browseReducerPersistConfig,
  browseReducer,
)

// playlistReducer
const playlistReducerPersistConfig = {
  key: "playlistReducer",
  storage: AsyncStorage,
  blacklist: ["playlistDetails"],
}

const persistedPlaylistReducer = persistReducer(
  playlistReducerPersistConfig,
  playlistReducer,
)

// searchReducer
const searchReducerPersistConfig = {
  key: "searchReducer",
  storage: AsyncStorage,
  whitelist: ["queryHistory"],
}

const persistedSearchReducer = persistReducer(
  searchReducerPersistConfig,
  searchReducer,
)

const rootReducer = combineReducers({
  userReducer,
  globalReducer: persistedglobalReducer,
  albumReducer,
  libraryReducer,
  browseReducer: persistedBrowseReducer,
  personalizationReducer,
  followRedcuer,
  playlistReducer: persistedPlaylistReducer,
  artistReducer,
  searchReducer: persistedSearchReducer,
})

export type RootStoreType = ReturnType<typeof rootReducer>

export type DispatchFun<P> = ({ type, payload }: Action<P>) => void
export type Action<P> = { type: string; payload?: P }

export default persistReducer(rootPersistConfig, rootReducer)
