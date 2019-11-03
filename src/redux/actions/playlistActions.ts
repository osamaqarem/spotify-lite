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
  ErrorResponse,
  PlaylistResponse,
  RecentlyPlayedResponse,
} from "../../data/types";
import { SPOTIFY_API_BASE } from "../../utils";
import { authActions, playlistActions, libraryActions } from "./actionTypes";
import { getMultipleAlbums } from "./albumActions";

export const getRecentlyPlayed = () => ({
  type: playlistActions.RECENTLY_PLAYED,
});

export const getRecentlyPlayedEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(playlistActions.RECENTLY_PLAYED),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.authReducer;

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
          //     arrayOfActions.push(Action<any>;
          //     return;
          //   } else if (arrayOfIds.indexOf(id) === -1) {
          //     arrayOfIds.push(id);
          //     const action = getPlayListCoverById(id);
          //     arrayOfActions.push(Action<any>;
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
      const { token } = state.authReducer;

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
        map(res => res.flat()),
        map((res: PlaylistResponse[] | ErrorResponse) => {
          if ("error" in res) throw res.error.message;

          const data = res.map(item => {
            return { name: item.description, url: item.images[0].url };
          });

          return of(
            { type: playlistActions.GET_PLAYLIST_COVER_BY_ID_SUCCESS },
            {
              type: libraryActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS,
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
          reactotron.log(JSON.stringify(err));
          return of({
            type: playlistActions.GET_PLAYLIST_COVER_BY_ID_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );
