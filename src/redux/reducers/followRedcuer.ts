import { Action } from "../../data/models";
import { followActions } from "../actions";

const initialState = {
  currentUserSavedArtists: [],
};

export default (state = initialState, { type, payload }: Action<any>) => {
  switch (type) {
    case followActions.GET_CURRENT_USER_FOLLOWED_ARTISTS_SUCCESS:
      return {
        ...state,
        currentUserSavedArtists: payload,
      };
    default:
      return state;
  }
};
