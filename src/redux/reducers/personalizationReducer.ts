import { Action } from "../../data/models";
import { personalizationActions } from "../actions";
import { AlbumType } from "../../screens/HomeScreen";

export type PersonalizationReducerType = {
  userTopArtists: [];
  userTopArtistsHeader: AlbumType;
};

const initialState: PersonalizationReducerType = {
  userTopArtists: [],
  userTopArtistsHeader: { name: null, url: null },
};

export default (state = initialState, { type, payload }: Action<any>) => {
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
