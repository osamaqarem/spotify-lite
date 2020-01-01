import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, interval, Observable, of } from "rxjs";
import {
  catchError,
  map,
  mapTo,
  mergeMap,
  startWith,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import {
  Action,
  ErrorResponse,
  RecentlyPlayedResponse,
} from "../../data/models";
import { SPOTIFY_API_BASE } from "../../utils";
import { RootStoreType } from "../store";
import { playerActions, globalActions } from "./actionTypes";
import { getMultipleAlbums } from "./albumActions";
import { redoLogin } from "./userActions";

export const getRecentlyPlayedTracksEpic = (
  actions$: Observable<Action<undefined>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(globalActions.REHYDRATE_FROM_API),
    withLatestFrom(state$),
    switchMap(state =>
      interval(180 * 1000).pipe(mapTo(state), startWith(state)),
    ),
    switchMap(([, state]) => {
      const { token } = state.userReducer;

      const request$ = from(
        fetch(`${SPOTIFY_API_BASE}/me/player/recently-played?limit=20`, {
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
            return of(redoLogin());
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
