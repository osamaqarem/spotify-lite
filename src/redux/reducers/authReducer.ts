import { Action } from "../../data/types";
import { storeTokens } from "../../utils";
import { authActions } from "../actions";

const initialState = {
  token: null,
  refreshToken: null,
  profile: null,
  error: null,
};

export default (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case authActions.GET_TOKENS_SUCCESS:
      storeTokens(payload);
      return { ...state, ...payload };
    case authActions.SET_TOKENS:
      return { ...state, ...payload };
    case authActions.PROFILE_SUCCESS:
      return { ...state, ...payload };
    case authActions.ERROR:
      return { ...state, ...payload };
    default:
      return state;
  }
};
