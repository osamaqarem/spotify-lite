import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  Action,
  AlbumType,
  CurrentUserSavedArtistsResponse,
  ErrorResponse,
} from "../../data/models";
import { API } from "../../utils";
import { followActions } from "./actionTypes";

export const getCurrentUserSavedArtists = () => ({
  type: followActions.GET_CURRENT_USER_FOLLOWED_ARTISTS,
});

export const getCurrentUserSavedArtistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(followActions.GET_CURRENT_USER_FOLLOWED_ARTISTS),
    withLatestFrom(state$),
    switchMap(([, { userReducer }]: any) => {
      const { token } = userReducer;

      const request$ = from(
        fetch(API.getCurrentUserSavedArtists, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: CurrentUserSavedArtistsResponse | ErrorResponse) => {
          if ("error" in res) throw res.error.message;

          const data: AlbumType[] = res.artists.items.map(item => {
            return {
              url: (item.images[0] && item.images[0].url) || null,
              name: item.name,
              id: item.id,
            };
          });

          return {
            type: followActions.GET_CURRENT_USER_FOLLOWED_ARTISTS_SUCCESS,
            payload: data,
          };
        }),
        catchError(err => {
          if (typeof err === "string" && err.includes("expired")) {
            return of(getCurrentUserSavedArtists());
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: followActions.GET_CURRENT_USER_FOLLOWED_ARTISTS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );
