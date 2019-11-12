import { Action } from "../../data/models";
import { storeTokens } from "../../utils";
import { userActions } from "../actions";

const initialState = {
  token: null,
  refreshToken: null,
  profile: null,
  error: null,
};

export default (state = initialState, { type, payload }: Action<any>) => {
  switch (type) {
    case userActions.GET_TOKENS_SUCCESS:
      storeTokens(payload);
      return { ...state, ...payload };
    case userActions.SET_TOKENS:
      return { ...state, ...payload };
    case userActions.PROFILE_SUCCESS:
      return { ...state, profile: payload };
    case userActions.ERROR:
      return { ...state, ...payload };
    default:
      return state;
  }
};
