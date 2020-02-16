import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import reactotron from "../../../ReactotronConfig";
import { Action } from "../../data/models/redux";
import { Album, AlbumType, ErrorResponse } from "../../data/models/spotify";
import { REST_API } from "../../utils/constants";
import { PlaylistDetailsType } from "../reducers/playlistReducer";
import { albumActions, globalActions, playlistActions } from "./actionTypes";
import { redoLogin } from "./userActions";

export const getAlbumById = (id: string) => ({
  type: albumActions.GET_ALBUM,
  payload: id,
});

export const getAlbumByIdEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(albumActions.GET_ALBUM),
    withLatestFrom(state$),
    switchMap(([{ payload: id }, state]) => {
      const { token } = state.userReducer;

      const request$ = from(
        fetch(REST_API.getAlbumById + id, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: Album | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          const tracks = res.tracks.items.map((track, i) => ({
            name: track.name,
            artistName: track.artists[i]?.name || res.artists[0].name,
          }));

          const album: PlaylistDetailsType = {
            name: res.name,
            ownerName: res.artists[0].name,
            tracks,
            imageUrl: res.images[0].url,
          };

          return {
            type: playlistActions.GET_PLAYLIST_DETAILS_SUCCESS,
            payload: album,
          };
        }),
        catchError(err => {
          if (
            typeof err === "string" &&
            typeof err === "string" &&
            err.includes("expired")
          ) {
            return of(redoLogin(), {
              type: globalActions.PUSH_ACTION_TO_RESTART,
              payload: getAlbumById(id),
            });
          }
          // handle error
          reactotron.log!(JSON.stringify(err));
          return of({
            type: albumActions.GET_ALBUM_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );

export const getMultipleAlbums = (commaList: string) => ({
  type: albumActions.GET_MULTIPLE_ALBUM,
  payload: commaList,
});

export const getMultipleAlbumsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(albumActions.GET_MULTIPLE_ALBUM),
    withLatestFrom(state$),
    switchMap(([{ payload: commaList }, state]) => {
      const { token } = state.userReducer;

      const request$ = from(
        fetch(REST_API.getMultipleAlbums + commaList, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: { albums: Album[] } | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          // we want array of url strings
          const albumImageUrls: AlbumType[] = res.albums.map(
            // [2] is lowest quality
            // [0] is highest quality
            album => ({
              name: album.name,
              imageURL: album.images[0].url,
              id: album.id,
            }),
          );

          return {
            type: albumActions.GET_MULTIPLE_ALBUM_SUCCESS,
            payload: albumImageUrls,
          };
        }),
        catchError(err => {
          if (typeof err === "string" && err.includes("expired")) {
            return of(redoLogin(), {
              type: globalActions.PUSH_ACTION_TO_RESTART,
              payload: getMultipleAlbums(commaList),
            });
          }
          // handle error
          reactotron.log!(JSON.stringify(err));
          return of({
            type: albumActions.GET_MULTIPLE_ALBUM_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );
