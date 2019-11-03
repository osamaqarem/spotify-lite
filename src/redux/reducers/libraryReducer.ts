import { libraryActions } from "../actions";
import { Action } from "../../data/types";

const initialState = {
  featuredPlaylists: [{ name: null, url: null }],
  userTopArtists: [{ name: null, url: null }],
  userTopArtistsHeader: { name: null, url: null },
};

export default (state = initialState, { type, payload }: Action<any>) => {
  switch (type) {
    case libraryActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS:
      return { ...state, featuredPlaylists: payload };
    case libraryActions.GET_USER_TOP_ARTISTS_SUCCESS:
      return {
        ...state,
        userTopArtists: payload.data,
        userTopArtistsHeader: payload.header,
      };
    default:
      return state;
  }
};
