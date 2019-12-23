import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  Action,
  ErrorResponse,
  UserTopArtistsResponse,
  AlbumType,
} from "../../data/models";
import { SPOTIFY_API_BASE } from "../../utils";
import { userActions, personalizationActions } from "./actionTypes";

export const getCurrentUserTopArtists = () => ({
  type: personalizationActions.GET_USER_TOP_ARTISTS,
});

export const getCurrentUserTopArtistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(personalizationActions.GET_USER_TOP_ARTISTS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.userReducer;

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

          const artists: AlbumType[] = res.items.map(item => {
            return { name: item.name, url: item.images[0].url, id: item.id };
          });

          const data = artists.slice(1, artists.length);
          const header = artists[0];

          return {
            type: personalizationActions.GET_USER_TOP_ARTISTS_SUCCESS,
            payload: { data, header },
          };
        }),
        catchError(err => {
          if (typeof err === "string" && err.includes("expired")) {
            return of({
              type: userActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.userReducer.refreshToken,
                actionToRestart: getCurrentUserTopArtists(),
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: personalizationActions.GET_USER_TOP_ARTISTS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );
