import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import {
  Action,
  ErrorResponse,
  RecentlyPlayedResponse,
} from "../../data/models";
import { SPOTIFY_API_BASE } from "../../utils";
import { playerActions, userActions } from "./actionTypes";
import { getMultipleAlbums } from "./albumActions";

export const getRecentlyPlayed = () => ({
  type: playerActions.RECENTLY_PLAYED_TRACKS,
});

export const getRecentlyPlayedEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(playerActions.RECENTLY_PLAYED_TRACKS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.userReducer;

      const request$ = from(
        fetch(`${SPOTIFY_API_BASE}/v1/me/player/recently-played?limit=20`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );
      return request$.pipe(
        switchMap(res => res.json()),
        map((res: RecentlyPlayedResponse | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }
          // Logic for filtering recently played to get albums comma string
          let commaList = "";
          res.items.forEach(item => {
            const [, albumId] = item.track.album.href.split("albums/");
            if (!commaList.includes(albumId))
              commaList = commaList.concat(albumId + ",");
          });
          // Remove last comma. else request fails
          const commaListCommaRemoved = commaList.slice(
            0,
            commaList.length - 1,
          );

          return of(
            { type: playerActions.RECENTLY_PLAYED_TRACKS_SUCCESS },
            getMultipleAlbums(commaListCommaRemoved),
          );
        }),
        mergeMap(a => a),
        catchError(err => {
          if (typeof err === "string" && err.includes("expired")) {
            return of({
              type: userActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.userReducer.refreshToken,
                actionToRestart: getRecentlyPlayed,
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: playerActions.RECENTLY_PLAYED_TRACKS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );
