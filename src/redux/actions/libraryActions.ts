import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  Action,
  ErrorResponse,
  FeaturedPlaylistsResponse,
} from "../../data/types";
import { SPOTIFY_API_BASE } from "../../utils";
import { authActions, libraryActions } from "./actionTypes";

export const getAllFeaturedPlaylists = () => ({
  type: libraryActions.GET_ALL_FEATURED_PLAYLISTS,
});

export const getAllFeaturedPlaylistsEpic = (
  actions$: Observable<Action>,
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

          const data = res.playlists.items.map(item => {
            return { name: item.name, url: item.images[0].url };
          });

          return {
            type: libraryActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS,
            payload: data,
          };
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
