import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import reactotron from "../../../ReactotronConfig";
import { Action, ErrorResponse } from "../../data/types";
import { AlbumListResponse } from "../../data/types/AlbumListResponse";
import { SPOTIFY_API_BASE } from "../../utils";
import { albumActions, userActions } from "./actionTypes";

// export const getAlbumById = (href: string) => ({
//   type: albumActions.GET_ALBUM,
//   payload: href,
// });

// export const getAlbumEpic = (
//   actions$: Observable<Action<any>>,
//   state$: Observable<any>,
// ) =>
//   actions$.pipe(
//     ofType(albumActions.GET_ALBUM),
//     withLatestFrom(state$),
//     concatMap(([{ payload: href }, state]) => {
//       const { token } = state.userReducer;

//       debugger;

//       const request$ = from(
//         fetch(href, {
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
//         }),
//         catchError(err => {
//           if (err.includes("expired")) {
//             return of({
//               type: authActions.REFRESH_TOKEN,
//               payload: {
//                 refreshToken: state.userReducer.refreshToken,
//                 actionToRestart: getAlbumById(href),
//               },
//             });
//           }
//           // handle error
//           reactotron.log(JSON.stringify(err));
//           return of({
//             type: albumActions.GET_ALBUM_ERROR,
//             payload: err,
//           });
//         }),
//       );
//     }),
//   );

export const getMultipleAlbums = (commaList: string) => ({
  type: albumActions.GET_ALBUM,
  payload: commaList,
});

export const getMultipleAlbumsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(albumActions.GET_ALBUM),
    withLatestFrom(state$),
    switchMap(([{ payload: commaList }, state]) => {
      const { token } = state.userReducer;

      const request$ = from(
        fetch(`${SPOTIFY_API_BASE}/v1/albums?ids=${commaList}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: AlbumListResponse | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          // we want array of url strings
          const albumImageUrls = res.albums.map(
            // [2] is lowest quality
            // [0] is highest quality
            album => ({ name: album.name, url: album.images[0].url }),
          );

          return {
            type: albumActions.GET_MULTIPLE_ALBUM_SUCCESS,
            payload: albumImageUrls,
          };
        }),
        catchError(err => {
          if (err.includes("expired")) {
            return of({
              type: userActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.userReducer.refreshToken,
                actionToRestart: getMultipleAlbums(commaList),
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: albumActions.GET_MULTIPLE_ALBUM_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );
