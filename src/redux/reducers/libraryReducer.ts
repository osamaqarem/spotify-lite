import { libraryActions, playlistActions } from "../actions";
import { Action } from "../../data/types";

const initialState = {
  featuredPlaylists: [],
  userTopArtists: [],
  userTopArtistsHeader: { name: null, url: null },
  currentUserPlaylists: [],
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
    case playlistActions.GET_CURRENT_USER_PLAYLISTS_SUCCESS:
      return {
        ...state,
        currentUserPlaylists: payload,
      };
    default:
      return state;
  }
};
