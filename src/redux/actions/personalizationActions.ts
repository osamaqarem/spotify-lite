import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  AlbumType,
  Artist,
  ErrorResponse,
  SpotifyPager,
} from "../../data/models/spotify";
import { REST_API } from "../../utils/constants";
import { Action } from "../../data/models/redux";
import { globalActions, personalizationActions } from "./actionTypes";
import { redoLogin } from "./userActions";

export const getCurrentUserTopArtistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(globalActions.REHYDRATE_FROM_API),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.userReducer;

      const request$ = from(
        fetch(REST_API.getCurrentUserTopArtists, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: SpotifyPager<Artist> | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          const artists: AlbumType[] = res.items.map(item => {
            return {
              name: item.name,
              imageURL: item.images[0].url,
              id: item.id,
            };
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
            return of(redoLogin());
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
