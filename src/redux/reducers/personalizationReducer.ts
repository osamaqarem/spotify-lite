import { Action } from "../../data/models/redux";

import { AlbumType } from "../../data/models/spotify";
import { personalizationActions } from "../actions";

type PersonalizationReducerType = {
  userTopArtists: AlbumType[];
  userTopArtistsHeader: AlbumType | null;
};

const initialState: PersonalizationReducerType = {
  userTopArtists: [],
  userTopArtistsHeader: null,
};

export default (
  state = initialState,
  { type, payload }: Action<any>,
): PersonalizationReducerType => {
  switch (type) {
    case personalizationActions.GET_USER_TOP_ARTISTS_SUCCESS:
      return {
        ...state,
        userTopArtists: payload.data,
        userTopArtistsHeader: payload.header,
      };
    default:
      return state;
  }
};
