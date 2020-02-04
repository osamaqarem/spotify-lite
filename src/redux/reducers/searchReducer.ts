import { searchActions } from "../actions";
import { Action } from "../../data/models/redux";
import { AlbumType } from "../../data/models/spotify";

export type ResultKey =
  | "albums"
  | "tracks"
  | "artists"
  | "playlists"
  | "random";
export type SearchResult = Record<ResultKey, AlbumType[]>;

type SearchReducerType = {
  results: SearchResult;
  resultsHave: {
    havePlaylists: boolean;
    haveAlbums: boolean;
    haveTracks: boolean;
    haveArtists: boolean;
  };
};

const initialState: SearchReducerType = {
  results: {
    albums: [],
    artists: [],
    playlists: [],
    tracks: [],
    random: [],
  },
  resultsHave: {
    havePlaylists: false,
    haveAlbums: false,
    haveTracks: false,
    haveArtists: false,
  },
};

export default (
  state = initialState,
  { type, payload }: Action<any>,
): SearchReducerType => {
  switch (type) {
    case searchActions.QUERY_SUCCESS:
      return {
        ...state,
        results: payload.results,
        resultsHave: payload.resultsHave,
      };
    default:
      return state;
  }
};
