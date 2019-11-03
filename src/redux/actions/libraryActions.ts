import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  Action,
  ErrorResponse,
  FeaturedPlaylistsResponse,
  UserTopArtistsResponse,
} from "../../data/types";
import { SPOTIFY_API_BASE } from "../../utils";
import { authActions, libraryActions } from "./actionTypes";
import { getPlayListCoverById } from "./playlistActions";

export const getAllFeaturedPlaylists = () => ({
  type: libraryActions.GET_ALL_FEATURED_PLAYLISTS,
});

export const getAllFeaturedPlaylistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(libraryActions.GET_ALL_FEATURED_PLAYLISTS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.authReducer;

      const request$ = from(
        fetch(SPOTIFY_API_BASE + "/v1/browse/featured-playlists?limit=8", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: FeaturedPlaylistsResponse | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          // const data = res.playlists.items.map(item => {
          //   return { name: item.name, url: item.images[0].url };
          // });

          const playlistIds = res.playlists.items.map(item => item.id);

          return getPlayListCoverById(playlistIds);
        }),
        catchError(err => {
          if (err.includes("expired")) {
            return of({
              type: authActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.authReducer.refreshToken,
                actionToRestart: getAllFeaturedPlaylists(),
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: libraryActions.GET_ALL_FEATURED_PLAYLISTS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );

export const getCurrentUserTopArtists = () => ({
  type: libraryActions.GET_USER_TOP_ARTISTS,
});

export const getCurrentUserTopArtistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(libraryActions.GET_USER_TOP_ARTISTS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.authReducer;

      const request$ = from(
        fetch(SPOTIFY_API_BASE + "/v1/me/top/artists?limit=19", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: UserTopArtistsResponse | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          const artists = res.items.map(item => {
            return { name: item.name, url: item.images[0].url };
          });

          const data = artists.slice(1, artists.length);
          const header = artists[0];

          return {
            type: libraryActions.GET_USER_TOP_ARTISTS_SUCCESS,
            payload: { data, header },
          };
        }),
        catchError(err => {
          if (err.includes("expired")) {
            return of({
              type: authActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.authReducer.refreshToken,
                actionToRestart: getCurrentUserTopArtists(),
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: libraryActions.GET_USER_TOP_ARTISTS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );
