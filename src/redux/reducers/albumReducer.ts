import { Action, AlbumType } from "../../data/models";
import { albumActions } from "../actions";

type AlbumReducerType = {
  recentlyPlayedAlbums: AlbumType[];
};

const initialState: AlbumReducerType = {
  recentlyPlayedAlbums: [],
};

export default (
  state = initialState,
  { type, payload }: Action<any>,
): AlbumReducerType => {
  switch (type) {
    case albumActions.GET_MULTIPLE_ALBUM_SUCCESS:
      return { ...state, recentlyPlayedAlbums: payload };
    default:
      return state;
  }
};
