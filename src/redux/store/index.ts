import { applyMiddleware, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";
import Reactotron from "../../../ReactotronConfig";
import persistedReducer, { rootEpic } from "../reducers";
import { enableBatching } from "redux-batched-actions";

// Redux observable
const epicMiddleware = createEpicMiddleware();

const store = createStore(
  enableBatching(persistedReducer),
  {},
  compose(applyMiddleware(thunk, epicMiddleware), Reactotron.createEnhancer()),
);

// Redux observable
epicMiddleware.run(rootEpic);

// Redux persist
const persistor = persistStore(store);

export { store, persistor };
