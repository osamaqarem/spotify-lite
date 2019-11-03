import { Action } from "../../data/types";
import { loadingActions } from "../actions";

const initialState = {
  loading: false,
};

export default (state = initialState, { type, payload }: Action<any>) => {
  switch (type) {
    case loadingActions.LOADING:
      return { ...state, ...payload };
    case loadingActions.DONE:
      return { ...state, ...payload };

    default:
      return state;
  }
};
