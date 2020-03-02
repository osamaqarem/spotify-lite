import thunk from "redux-thunk"
import { configureStore } from "@reduxjs/toolkit"
import { combineEpics, createEpicMiddleware } from "redux-observable"
import { persistStore } from "redux-persist"
import reactotron from "../../reactotron"
import persistedReducer from "./rootReducer"
import {
  albumEpics,
  browseEpics,
  followEpics,
  globalEpics,
  libraryEpics,
  personalizationEpics,
  playlistEpics,
  searchEpics,
  userEpics,
} from "./slices"

export const rootEpic = combineEpics(
  ...albumEpics,
  ...browseEpics,
  ...followEpics,
  ...globalEpics,
  ...libraryEpics,
  ...personalizationEpics,
  ...playlistEpics,
  ...searchEpics,
  ...userEpics,
)

// Redux observable
const epicMiddleware = createEpicMiddleware()

const store = configureStore({
  reducer: persistedReducer,
  middleware: [epicMiddleware, thunk],
  enhancers: (__DEV__ && [reactotron.createEnhancer()]) || undefined,
})

// Redux observable
epicMiddleware.run(rootEpic)

// Redux persist
const persistor = persistStore(store)

export { store, persistor }
