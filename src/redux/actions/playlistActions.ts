import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { Action } from "../../data/types";
import { SPOTIFY_API_BASE } from "../../utils";
import { playlistActions } from "./actionTypes";

export const getRecentlyPlayedEpic = (
  actions$: Observable<Action>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(playlistActions.RECENTLY_PLAYED),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.authReducer;

      const request$ = from(
        fetch(SPOTIFY_API_BASE + "/v1/me/player/recently-played?limit=1"),
      );
      return request$.pipe(
        switchMap(res => res.json()),
        map(res => {
          // TODO: res type
          // TODO: maintain recentlyplayed images and state in store? + link to get playlist tracks
          return { type: "test" };
        }),
        catchError(err => {
          // TODO: ERROR
          return of({ type: "", payload: err });
        }),
      );
    }),
  );
