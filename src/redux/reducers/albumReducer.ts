import { Action } from "../../data/models";
import { albumActions } from "../actions";

const initialState = {
  recentlyPlayedAlbums: [{ name: null, url: null }],
};

export default (state = initialState, { type, payload }: Action<any>) => {
  switch (type) {
    case albumActions.GET_MULTIPLE_ALBUM_SUCCESS:
      return { ...state, recentlyPlayedAlbums: payload };

    default:
      return state;
  }
};
