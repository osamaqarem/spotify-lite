import { Action } from "../../data/models";
import { loadingActions } from "../actions";

export type LoadingReducerType = {
  loading: boolean;
};
const initialState = {
  loading: false,
};

export default (state = initialState, { type }: Action<any>) => {
  switch (type) {
    case loadingActions.LOADING:
      return { ...state, loading: true };
    case loadingActions.DONE:
      return { ...state, loading: false };

    default:
      return state;
  }
};
