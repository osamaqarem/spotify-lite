import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { Action, ErrorResponse, PlaylistResponse } from "../../data/models";
import { CurrentUserPlaylistsResponse } from "../../data/models/CurrentUserPlaylistsResponse";
import { SPOTIFY_API_BASE } from "../../utils";
import { PlaylistDetailsType, TrackType } from "../reducers/playlistReducer";
import { RootStoreType } from "../store";
import { playlistActions } from "./actionTypes";

export const clearPlaylistDetails = () => ({
  type: playlistActions.CLEAR_PLAYLIST_DETAILS,
});
export const getPlayListById = (playListId: string) => ({
  type: playlistActions.GET_PLAYLIST_BY_ID,
  payload: playListId,
});

export const getPlayListByIdEpic = (
  actions$: Observable<Action<string>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(playlistActions.GET_PLAYLIST_BY_ID),
    withLatestFrom(state$),
    switchMap(
      ([{ payload: playListId }, state]: [Action<string>, RootStoreType]) => {
        const { token } = state.userReducer;

        const request$ = from(
          fetch(`https://api.spotify.com/v1/playlists/${playListId}`, {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }),
        );

        return request$.pipe(
          switchMap(res => res.json()),
          map((res: PlaylistResponse | ErrorResponse) => {
            if ("error" in res) throw res.error.message;

            const tracks: TrackType[] = res.tracks.items.map(item => ({
              artistName:
                item.track?.artists[0].name ??
                "No track returned by spotify :(",
              name: item.track?.name ?? "No track",
            }));

            const data: PlaylistDetailsType = {
              imageUrl: res.images[0].url,
              name: res.name,
              ownerName: res.owner.display_name,
              tracks,
            };

            return {
              type: playlistActions.GET_PLAYLIST_DETAILS_SUCCESS,
              payload: data,
            };
          }),
          catchError(err => {
            if (typeof err === "string" && err.includes("expired")) {
              return of(getPlayListById(playListId!));
            }
            // handle error
            reactotron.log(JSON.stringify(err));
            return of({
              type: playlistActions.GET_PLAYLIST_BY_ID_ERROR,
              payload: err,
            });
          }),
        );
      },
    ),
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
          if (typeof err === "string" && err.includes("expired")) {
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
