import { Action, UserProfileResponse } from "../../data/models";
import { userActions } from "../actions";

type UserReducerType = {
  token: null | string;
  profile: null | UserProfileResponse;
  authenticated: boolean;
};

const initialState: UserReducerType = {
  token: null,
  profile: null,
  authenticated: false,
};

export default (
  state = initialState,
  { type, payload }: Action<any>,
): UserReducerType => {
  switch (type) {
    case userActions.GET_TOKENS_SUCCESS:
      return { ...state, token: payload };
    case userActions.GET_PROFILE_SUCCESS:
      return { ...state, profile: payload, authenticated: true };
    default:
      return state;
  }
};
