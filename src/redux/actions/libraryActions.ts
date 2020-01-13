import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  Action,
  CurrentUserSavedAlbums,
  CurrentUserSavedTracks,
  ErrorResponse,
} from "../../data/models";
import { SPOTIFY_API_BASE, API } from "../../utils";
import { libraryActions } from "./actionTypes";
import { SavedAlbumType } from "../reducers/libraryReducer";

export const getCurrentUserSavedTracks = () => ({
  type: libraryActions.GET_CURRENT_USER_SAVED_TRACKS,
});

export const getCurrentUserSavedTracksEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(libraryActions.GET_CURRENT_USER_SAVED_TRACKS),
    withLatestFrom(state$),
    switchMap(([, { userReducer }]: any) => {
      const { token } = userReducer;

      const request$ = from(
        fetch(API.getCurrentUserSavedTracks, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: CurrentUserSavedTracks | ErrorResponse) => {
          if ("error" in res) throw res.error.message;

          return {
            type: libraryActions.GET_CURRENT_USER_SAVED_TRACKS_SUCCESS,
            payload: res.total,
          };
        }),
        catchError(err => {
          if (typeof err === "string" && err.includes("expired")) {
            return of(getCurrentUserSavedTracks());
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: libraryActions.GET_CURRENT_USER_SAVED_TRACKS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );

export const getCurrentUserSavedAlbums = () => ({
  type: libraryActions.GET_CURRENT_USER_SAVED_ALBUMS,
});

export const getCurrentUserSavedAlbumsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(libraryActions.GET_CURRENT_USER_SAVED_ALBUMS),
    withLatestFrom(state$),
    switchMap(([, { userReducer }]: any) => {
      const { token } = userReducer;

      const request$ = from(
        fetch(API.getCurrentUserSavedAlbums, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: CurrentUserSavedAlbums | ErrorResponse) => {
          if ("error" in res) throw res.error.message;

          const data: SavedAlbumType[] = res.items.map(item => {
            return {
              owner: item.album.artists[0].name,
              url: (item.album.images[0] && item.album.images[0].url) || null,
              name: item.album.name,
              id: item.album.id,
            };
          });

          return {
            type: libraryActions.GET_CURRENT_USER_SAVED_ALBUMS_SUCCESS,
            payload: data,
          };
        }),
        catchError(err => {
          if (typeof err === "string" && err.includes("expired")) {
            return of(getCurrentUserSavedAlbums());
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: libraryActions.GET_CURRENT_USER_SAVED_ALBUMS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );
