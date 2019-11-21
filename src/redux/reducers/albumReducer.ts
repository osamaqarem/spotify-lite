import { Action } from "../../data/models";
import { albumActions } from "../actions";

export type AlbumType = { name: string | null; url: string | null };

 type AlbumReducerType = { recentlyPlayedAlbums: AlbumType[] };

const initialState: AlbumReducerType = {
  recentlyPlayedAlbums: [],
};

export default (state = initialState, { type, payload }: Action<any>) : AlbumReducerType=> {
  switch (type) {
    case albumActions.GET_MULTIPLE_ALBUM_SUCCESS:
      return { ...state, recentlyPlayedAlbums: payload };

    default:
      return state;
  }
};
