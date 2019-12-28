import { Action } from "../../data/models";
import { libraryActions } from "../actions";

export type SavedAlbumType = {
  name: string;
  url: string | null;
  owner: string;
  id: string;
};

type LibraryReducerType = {
  currentUserSavedTracksCount: null | number;
  currentUserSavedAlbums: SavedAlbumType[];
};

const initialState: LibraryReducerType = {
  currentUserSavedTracksCount: null,
  currentUserSavedAlbums: [],
};

export default (
  state = initialState,
  { type, payload }: Action<any>,
): LibraryReducerType => {
  switch (type) {
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
