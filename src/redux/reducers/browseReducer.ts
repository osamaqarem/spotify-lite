import { Action } from "../../data/models";
import { browseActions } from "../actions";

export type CountryCategoryType = { name: string; id: string };

type BorwserReducerType = {
  featuredPlaylists: [];
  categoriesForCountry: CountryCategoryType[];
};

const initialState: BorwserReducerType = {
  featuredPlaylists: [],
  categoriesForCountry: [],
};

export default (state = initialState, { type, payload }: Action<any>) : BorwserReducerType => {
  switch (type) {
    case browseActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS:
      return { ...state, featuredPlaylists: payload };
    case browseActions.GET_ALL_CATEGORIES_FOR_COUNTRY_SUCCESS:
      return { ...state, categoriesForCountry: payload };
    default:
      return state;
  }
};
