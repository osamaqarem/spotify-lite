import AsyncStorage from "@react-native-community/async-storage";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createEpicMiddleware } from "redux-observable";
import combinedReducers, { rootEpic } from "../reducers";
import { persistStore, persistReducer } from "redux-persist";
import Reactotron from "../../../ReactotronConfig";

// Redux persist
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["userReducer", "loadingReducer", "albumReducer"],
};
const persistedReducer = persistReducer(persistConfig, combinedReducers);

// Redux observable
const epicMiddleware = createEpicMiddleware();

const store = createStore(
  persistedReducer,
  {},
  compose(applyMiddleware(thunk, epicMiddleware), Reactotron.createEnhancer()),
);

// Redux observable
epicMiddleware.run(rootEpic);

// Redux persist
const persistor = persistStore(store);

const redux = { store, persistor };

export type RootStoreType = ReturnType<typeof combinedReducers>;

export default redux;
