import { Action } from "../../data/models/redux";
import { artistActions } from "../actions";

type ArtistReducerType = {
  artistId: string | null;
};

const initialState: ArtistReducerType = {
  artistId: null,
};

export default (
  state = initialState,
  { type, payload }: Action<any>,
): ArtistReducerType => {
  switch (type) {
    case artistActions.SET_ARTIST_ID:
      return { ...state, artistId: payload };
    default:
      return state;
  }
};
