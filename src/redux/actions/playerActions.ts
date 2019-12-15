import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, interval, Observable, of } from "rxjs";
import {
  catchError,
  map,
  mapTo,
  mergeMap,
  switchMap,
  withLatestFrom,
  switchMapTo,
  startWith,
  concatMap,
  exhaustMap,
} from "rxjs/operators";
import {
  Action,
  ErrorResponse,
  RecentlyPlayedResponse,
} from "../../data/models";
import { SPOTIFY_API_BASE } from "../../utils";
import { RootStoreType } from "../store";
import { playerActions, userActions } from "./actionTypes";
import { getMultipleAlbums } from "./albumActions";

export const getRecentlyPlayedTracks = () => ({
  type: playerActions.RECENTLY_PLAYED_TRACKS,
});

export const getRecentlyPlayedTracksEpic = (
  actions$: Observable<Action<undefined>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(playerActions.RECENTLY_PLAYED_TRACKS),
    withLatestFrom(state$),
    switchMap(a => interval(180 * 1000).pipe(mapTo(a), startWith(a))),
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

          return of(getMultipleAlbums(commaListCommaRemoved));
        }),
        mergeMap(a => a),
        catchError(err => {
          if (typeof err === "string" && err.includes("expired")) {
            return of({
              type: userActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.userReducer.refreshToken,
                actionToRestart: getRecentlyPlayedTracks,
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
