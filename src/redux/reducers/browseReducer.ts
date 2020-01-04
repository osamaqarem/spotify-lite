import { Action, AlbumType } from "../../data/models";
import { browseActions } from "../actions";
import { PlaylistDetailsType } from "./playlistReducer";

export type CountryCategoryType = { name: string; id: string };
export type GenrePlaylist = PlaylistDetailsType & {
  followerCount: number;
};

type BorwserReducerType = {
  featuredPlaylists: AlbumType[];
  categoriesForCountry: CountryCategoryType[];
  genrePlaylists: GenrePlaylist[];
};

const initialState: BorwserReducerType = {
  featuredPlaylists: [],
  categoriesForCountry: [],
  genrePlaylists: [],
};

export default (
  state = initialState,
  { type, payload }: Action<any>,
): BorwserReducerType => {
  switch (type) {
    case browseActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS:
      return { ...state, featuredPlaylists: payload };
    case browseActions.GET_ALL_CATEGORIES_FOR_COUNTRY_SUCCESS:
      return { ...state, categoriesForCountry: payload };
    case browseActions.GET_CATEGORY_BY_ID_SUCCESS:
      return { ...state, genrePlaylists: payload };
    case browseActions.GET_MORE_CATEGORY_BY_ID:
      return {
        ...state,
        genrePlaylists: [...state.genrePlaylists, ...payload],
      };
    case browseActions.CLEAR_CATEGORY_PLAYLISTS:
      return {
        ...state,
        genrePlaylists: initialState.genrePlaylists,
      };
    default:
      return state;
  }
};
