import { Action, UserProfileResponse } from "../../data/models";
import { storeTokens } from "../../utils";
import { userActions } from "../actions";

export type UserReducerType = {
  token: null | string;
  refreshToken: null | string;
  profile: null | UserProfileResponse;
};

const initialState: UserReducerType = {
  token: null,
  refreshToken: null,
  profile: null,
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
    default:
      return state;
  }
};
