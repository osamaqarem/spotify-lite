import { Action } from "../types";

import { AlbumType } from "../../data/models/spotify";
import { browseActions } from "../actions";
import { PlaylistDetailsType } from "./playlistReducer";

export type CountryCategoryType = { name: string; id: string };

type BorwserReducerType = {
  featuredPlaylists: AlbumType[];
  categoriesForCountry: CountryCategoryType[];
  genreDetails: {
    genrePlaylists: PlaylistDetailsType[];
    title: string | null;
    id: string | null;
  };
  isLoading: boolean;
};

const initialState: BorwserReducerType = {
  featuredPlaylists: [],
  categoriesForCountry: [],
  genreDetails: { genrePlaylists: [], title: null, id: null },
  isLoading: false,
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
      return {
        ...state,
        genreDetails: {
          genrePlaylists: payload.data,
          title: payload.title,
          id: payload.id,
        },
      };
    case browseActions.GET_MORE_CATEGORY_BY_ID_SUCCESS:
      return {
        ...state,
        genreDetails: {
          ...state.genreDetails,
          genrePlaylists: [
            ...state.genreDetails.genrePlaylists,
            ...payload.data,
          ],
        },
      };
    case browseActions.IS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case browseActions.IS_NOT_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};
