import { libraryActions } from "../actions";
import { Action } from "../../data/types";

const initialState = {
  playlists: [{ name: null, url: null }],
};

export default (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case libraryActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS:
      return { ...state, playlists: payload };
    default:
      return state;
  }
};
