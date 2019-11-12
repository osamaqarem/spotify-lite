import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
  zipAll,
} from "rxjs/operators";
import {
  Action,
  CurrentUserSavedAlbums,
  CurrentUserSavedTracks,
  ErrorResponse,
  PlaylistResponse,
} from "../../data/models";
import { CurrentUserPlaylistsResponse } from "../../data/models/CurrentUserPlaylistsResponse";
import { SPOTIFY_API_BASE } from "../../utils";
import { browseActions, libraryActions, playlistActions } from "./actionTypes";

export const getPlayListCoverById = (playListIds: string[]) => ({
  type: playlistActions.GET_PLAYLIST_COVER_BY_ID,
  payload: playListIds,
});

export const getPlayListCoverByIdEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(playlistActions.GET_PLAYLIST_COVER_BY_ID),
    withLatestFrom(state$),
    switchMap(([{ payload: playListIds }, state]: [Action<string[]>, any]) => {
      const { token } = state.userReducer;

      const requestsArray = playListIds!.map((id: string) => {
        return from(
          fetch(`https://api.spotify.com/v1/playlists/${id}`, {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }),
        ).pipe(mergeMap(res => res.json()));
      });

      const requestsArray$ = from(requestsArray);

      return requestsArray$.pipe(
        zipAll(),
        map((res: PlaylistResponse[] | ErrorResponse) => {
          if ("error" in res) throw res.error.message;

          const data = res.map(item => {
            return { name: item.description, url: item.images[0].url };
          });

          return of(
            { type: playlistActions.GET_PLAYLIST_COVER_BY_ID_SUCCESS },
            {
              type: browseActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS,
              payload: data,
            },
          );
        }),
        mergeMap(a => a),
        catchError(err => {
          if (err.includes("expired")) {
            return of(getPlayListCoverById(playListIds!));
          }
          // handle error

          reactotron.log("whaaaat");
          reactotron.log(err);
          return of({
            type: playlistActions.GET_PLAYLIST_COVER_BY_ID_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );

export const getCurrentUserPlaylists = () => ({
  type: playlistActions.GET_CURRENT_USER_PLAYLISTS,
});

export const getCurrentUserPlaylistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(playlistActions.GET_CURRENT_USER_PLAYLISTS),
    withLatestFrom(state$),
    switchMap(([, { userReducer }]: any) => {
      const { token } = userReducer;

      const request$ = from(
        fetch(`${SPOTIFY_API_BASE}/v1/me/playlists`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: CurrentUserPlaylistsResponse | ErrorResponse) => {
          if ("error" in res) throw res.error.message;

          const data = res.items.map(item => {
            return {
              owner: item.owner.display_name,
              url: (item.images[0] && item.images[0].url) || null,
              name: item.name,
            };
          });

          return {
            type: playlistActions.GET_CURRENT_USER_PLAYLISTS_SUCCESS,
            payload: data,
          };
        }),
        catchError(err => {
          if (err.includes("expired")) {
            return of(getCurrentUserPlaylists());
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: playlistActions.GET_CURRENT_USER_PLAYLISTS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );

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
        fetch(`${SPOTIFY_API_BASE}/v1/me/tracks`, {
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
          if (err.includes("expired")) {
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
        fetch(`${SPOTIFY_API_BASE}/v1/me/albums`, {
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

          const data = res.items.map(item => {
            return {
              owner: item.album.artists[0].name,
              url: (item.album.images[0] && item.album.images[0].url) || null,
              name: item.album.name,
            };
          });

          return {
            type: libraryActions.GET_CURRENT_USER_SAVED_ALBUMS_SUCCESS,
            payload: data,
          };
        }),
        catchError(err => {
          if (err.includes("expired")) {
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
