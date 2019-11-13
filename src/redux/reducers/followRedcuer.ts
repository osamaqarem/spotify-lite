import { Action } from "../../data/models";
import { followActions } from "../actions";
import { AlbumType } from "./albumReducer";

export type FollowReducerType = {
  currentUserSavedArtists: AlbumType[];
};

const initialState: FollowReducerType = {
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
