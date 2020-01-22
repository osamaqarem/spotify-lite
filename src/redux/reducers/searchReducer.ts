import { searchActions } from "../actions";
import { Action } from "../types";

const initialState = {};

export default (state = initialState, { type, payload }: Action<any>) => {
  switch (type) {
    case searchActions.SEARCH_FOR_QUERY_SUCCESS:
      return { ...state, ...payload };

    default:
      return state;
  }
};
