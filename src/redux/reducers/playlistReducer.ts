import { playlistActions } from "../actions";
import { Action } from "../../data/models/redux";

export type TrackType = { name: string; artistName: string };

export type PlaylistDetailsType = {
  name: string;
  ownerName: string | null;
  imageUrl: string;
  tracks: TrackType[];
  followerCount?: number;
};

export type SavedPlaylistsType = {
  name: string;
  url: string | null;
  owner: string;
  id: string;
};

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
