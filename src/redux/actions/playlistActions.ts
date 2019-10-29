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
} from "../../data/types";
import { SPOTIFY_API_BASE } from "../../utils";
import { authActions, playlistActions } from "./actionTypes";
import { getMultipleAlbums } from "./albumActions";

export const getRecentlyPlayed = () => ({
  type: playlistActions.RECENTLY_PLAYED,
});

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
        fetch(`${SPOTIFY_API_BASE}/v1/me/player/recently-played`, {
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
            commaList = commaList.concat(albumId + ",");
          });
          // Remove last comma. else request fails
          const commaListCommaRemoved = commaList.slice(
            0,
            commaList.length - 1,
          );

          // // for keeping track of duplicate actions
          // let arrayOfIds: string[] = [];
          // // for storing actions
          // let arrayOfActions: Action[] = [];

          // res.items.forEach(({ context }, index) => {
          //   const { href } = context;
          //   // Get playlist id
          //   const [, id] = href.split("playlists/");

          //   if (index === 0) {
          //     arrayOfIds.push(id);
          //     const action = getPlayListCoverById(id);
          //     arrayOfActions.push(action);
          //     return;
          //   } else if (arrayOfIds.indexOf(id) === -1) {
          //     arrayOfIds.push(id);
          //     const action = getPlayListCoverById(id);
          //     arrayOfActions.push(action);
          //     return;
          //   }
          // });

          return of(
            { type: playlistActions.RECENTLY_PLAYED_SUCCESS },
            getMultipleAlbums(commaListCommaRemoved),
            // getPlayListCoverById(arrayOfHref),
          );
        }),
        mergeMap(a => a),
        catchError(err => {
          if (err.includes("expired")) {
            return of({
              type: authActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.authReducer.refreshToken,
                actionToRestart: getRecentlyPlayed,
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: playlistActions.RECENTLY_PLAYED_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );

// export const getPlayListCoverById = (playListId: string) => ({
//   type: playlistActions.GET_PLAYLIST_COVER_BY_ID,
//   payload: playListId,
// });

// export const getPlayListCoverByIdEpic = (
//   actions$: Observable<Action>,
//   state$: Observable<any>,
// ) =>
//   actions$.pipe(
//     ofType(playlistActions.GET_PLAYLIST_COVER_BY_ID),
//     withLatestFrom(state$),
//     concatMap(([{ payload: playListId }, state]) => {
//       const { token } = state.authReducer;

//       const request$ = from(
//         fetch(`https://api.spotify.com/v1/playlists/${playListId}/images`, {
//           method: "GET",
//           headers: {
//             authorization: `Bearer ${token}`,
//           },
//         }),
//       );

//       return request$.pipe(
//         switchMap(res => res.json()),
//         map(res => {
//           debugger;

//           return {
//             type: playlistActions.GET_PLAYLIST_COVER_BY_ID_SUCCESS,
//             payload: "",
//           };
//         }),
//         catchError(err => {
//           // FIXME: more efficient way of handling token expiry for this epic?
//           if (err.includes("expired")) {
//             return of(getRecentlyPlayed());
//           }
//           // handle error
//           reactotron.log(JSON.stringify(err));
//           return of({
//             type: playlistActions.GET_PLAYLIST_COVER_BY_ID_ERROR,
//             payload: err,
//           });
//         }),
//       );
//     }),
//   );
