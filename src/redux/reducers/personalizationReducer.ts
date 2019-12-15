import { Action, AlbumType } from "../../data/models";
import { personalizationActions } from "../actions";

type PersonalizationReducerType = {
  userTopArtists: [];
  userTopArtistsHeader: Pick<AlbumType, "name" | "url">;
};

const initialState: PersonalizationReducerType = {
  userTopArtists: [],
  userTopArtistsHeader: { name: null, url: null },
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
