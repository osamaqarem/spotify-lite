import { artistActions } from "./actionTypes";

export const setArtistId = (artistId: string) => ({
  type: artistActions.SET_ARTIST_ID,
  payload: artistId,
});
