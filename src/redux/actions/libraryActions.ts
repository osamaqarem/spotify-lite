import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { Action } from "../../data/models/redux";
import {
  ErrorResponse,
  PlaylistTrackObject,
  SavedAlbumObject,
  SpotifyPager,
} from "../../data/models/spotify";
import { REST_API } from "../../utils/constants";
import { SavedAlbumType } from "../reducers/libraryReducer";
import { PlaylistDetailsType, TrackType } from "../reducers/playlistReducer";
import { libraryActions } from "./actionTypes";

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
        fetch(REST_API.getCurrentUserSavedTracks, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: SpotifyPager<PlaylistTrackObject> | ErrorResponse) => {
          if ("error" in res) throw res.error.message;

          const tracks: TrackType[] = res.items.map(item => ({
            artistName: item.track.artists[0].name,
            name: item.track.name,
          }));

          const data: PlaylistDetailsType = {
            imageUrl: "https://i.imgur.com/N1uXnyS.jpg",
            tracks,
            name: "Favorite Songs",
            ownerName: null,
          };

          return {
            type: libraryActions.GET_CURRENT_USER_SAVED_TRACKS_SUCCESS,
            payload: { count: res.total, data },
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
        fetch(REST_API.getCurrentUserSavedAlbums, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: SpotifyPager<SavedAlbumObject> | ErrorResponse) => {
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
