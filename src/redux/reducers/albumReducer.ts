import { Action } from "../../data/models";
import { albumActions } from "../actions";

export type AlbumType = { name: string | null; url: string | null; id: string };
export type AlbumDetailsType = {
  name: string;
  artistName: string;
  imageUrl: string;
  tracks: { name: string; artistName: string }[];
  dominantColor?: string;
};
type AlbumReducerType = {
  recentlyPlayedAlbums: AlbumType[];
  albumDetails: AlbumDetailsType | null;
};

const initialState: AlbumReducerType = {
  recentlyPlayedAlbums: [],
  albumDetails: null,
};

export default (
  state = initialState,
  { type, payload }: Action<any>,
): AlbumReducerType => {
  switch (type) {
    case albumActions.GET_MULTIPLE_ALBUM_SUCCESS:
      return { ...state, recentlyPlayedAlbums: payload };
    case albumActions.GET_ALBUM_SUCCESS:
      return { ...state, albumDetails: payload };

    default:
      return state;
  }
};
