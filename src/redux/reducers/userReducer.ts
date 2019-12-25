import { Action, UserProfileResponse } from "../../data/models";
import { userActions, globalActions } from "../actions";

type UserReducerType = {
  token: null | string;
  profile: null | UserProfileResponse;
  authenticated: boolean;
  actionsToRestart: Action<any>[];
};

const initialState: UserReducerType = {
  token: null,
  profile: null,
  authenticated: false,
  actionsToRestart: [{ type: globalActions.REHYDRATE_FROM_API }], // always rehydrate upon renewing token
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
    case globalActions.PUSH_ACTION_TO_RESTART:
      return {
        ...state,
        actionsToRestart: [...state.actionsToRestart, payload],
      };
    case userActions.REDO_LOGIN:
      return { ...state, authenticated: false };
    default:
      return state;
  }
};
