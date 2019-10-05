import {createStore, compose, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {createEpicMiddleware} from "redux-observable";
import reducers, {rootEpic} from "../reducers";

const epicMiddleware = createEpicMiddleware();

const store = createStore(
  reducers,
  {},
  compose(applyMiddleware(thunk, epicMiddleware)),
);

epicMiddleware.run(rootEpic);

export default store;
