import { Action } from "../../data/types";
import { loadingActions } from "../actions";

const initialState = {
  loading: false,
};

export default (state = initialState, { type, payload }: Action<any>) => {
  switch (type) {
    case loadingActions.LOADING:
      return { ...state, loading: true };
    case loadingActions.DONE:
      return { ...state, loading: false };

    default:
      return state;
  }
};
