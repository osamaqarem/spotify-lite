import { Action } from "../../data/types";
import { browseActions } from "../actions";

const initialState = {
  featuredPlaylists: [],
  categoriesForCountry: [],
};

export default (state = initialState, { type, payload }: Action<any>) => {
  switch (type) {
    case browseActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS:
      return { ...state, featuredPlaylists: payload };
    case browseActions.GET_ALL_CATEGORIES_FOR_COUNTRY_SUCCESS:
      return { ...state, categoriesForCountry: payload };
    default:
      return state;
  }
};
