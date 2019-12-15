import { playlistActions } from "../actions";
import { Action } from "../../data/models";

export type TrackType = { name: string; artistName: string };

export type PlaylistDetailsType = {
  name: string;
  ownerName: string;
  imageUrl: string;
  tracks: TrackType[];
  playlistType: "PLAYLIST" | "ARTIST" | "ALBUM";
};

export type SavedPlaylistsType = { name: string; url: string; owner: string };

type PlaylistReducerType = {
  playlistDetails: PlaylistDetailsType | null;
  currentUserPlaylists: SavedPlaylistsType[];
};

const initialState: PlaylistReducerType = {
  playlistDetails: null,
  currentUserPlaylists: [],
};

export default (
  state = initialState,
  { type, payload }: Action<any>,
): PlaylistReducerType => {
  switch (type) {
    case playlistActions.GET_CURRENT_USER_PLAYLISTS_SUCCESS:
      return {
        ...state,
        currentUserPlaylists: payload,
      };
    case playlistActions.GET_PLAYLIST_DETAILS_SUCCESS:
      return { ...state, playlistDetails: payload };
    case playlistActions.CLEAR_PLAYLIST_DETAILS:
      return { ...state, playlistDetails: null };
    default:
      return state;
  }
};