import { libraryActions } from "../actions";
import { Action } from "../types";
import { TrackType, PlaylistDetailsType } from "./playlistReducer";

export type SavedAlbumType = {
  name: string;
  url: string | null;
  owner: string;
  id: string;
};

type LibraryReducerType = {
  currentUserSavedTracksCount: null | number;
  currentUserSavedTracks: PlaylistDetailsType | null;
  currentUserSavedAlbums: SavedAlbumType[];
};

const initialState: LibraryReducerType = {
  currentUserSavedTracksCount: null,
  currentUserSavedTracks: null,
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
        currentUserSavedTracksCount: payload.count,
        currentUserSavedTracks: payload.data,
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
