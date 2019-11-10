import { libraryActions, playlistActions } from "../actions";
import { Action } from "../../data/types";

const initialState = {
  currentUserPlaylists: [],
  currentUserSavedTracksCount: null,
  currentUserSavedAlbums: [],
};

export default (state = initialState, { type, payload }: Action<any>) => {
  switch (type) {
    case playlistActions.GET_CURRENT_USER_PLAYLISTS_SUCCESS:
      return {
        ...state,
        currentUserPlaylists: payload,
      };
    case libraryActions.GET_CURRENT_USER_SAVED_TRACKS_SUCCESS:
      return {
        ...state,
        currentUserSavedTracksCount: payload,
      };
    case libraryActions.GET_CURRENT_USER_SAVED_ALBUMS_SUCCESS:
      return {
        ...state,
        currentUserSavedAlbums: payload,
      };
    default:
      return state;
  }
};
