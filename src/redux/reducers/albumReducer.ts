import { Action } from "../../data/types";
import { albumActions } from "../actions";

const initialState = {
  recentlyPlayedAlbums: [],
};

export default (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case albumActions.GET_MULTIPLE_ALBUM_SUCCESS:
      return { ...state, recentlyPlayedAlbums: payload };

    default:
      return state;
  }
};
