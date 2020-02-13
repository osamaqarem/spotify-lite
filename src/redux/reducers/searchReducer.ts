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
  queryLoading: boolean;
  queryEmpty: boolean;
  lastQuery: string;
  queryHistory: AlbumType[];
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
  queryLoading: false,
  queryEmpty: false,
  lastQuery: "",
  queryHistory: [],
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
        queryLoading: false,
        lastQuery: "",
      };
    case searchActions.QUERY_ERROR:
      return {
        ...state,
        lastQuery: "",
        queryLoading: false,
      };
    case searchActions.QUERY_LOADING:
      return {
        ...state,
        queryLoading: true,
        queryEmpty: false,
        lastQuery: "",
        results: initialState.results,
        resultsHave: initialState.resultsHave,
      };
    case searchActions.QUERY_EMPTY:
      return {
        ...state,
        queryLoading: false,
        queryEmpty: true,
        lastQuery: payload,
      };
    case searchActions.QUERY_SAVE:
      if (state.queryHistory.findIndex(item => item.id === payload.id) === -1) {
        return {
          ...state,
          queryHistory: [payload, ...state.queryHistory],
        };
      }
    case searchActions.QUERY_DELETE:
      const historyCopy = [...state.queryHistory];
      const deleteIndex = historyCopy.findIndex(item => item.id === payload.id);
      historyCopy.splice(deleteIndex, 1);
      return {
        ...state,
        queryHistory: historyCopy,
      };
    default:
      return state;
  }
};
