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
  FeaturedPlaylistsResponse,
  PlaylistResponse,
  Playlists,
  RecentlyPlayedResponse,
  UserTopArtistsResponse,
} from "../../data/types";
import { SPOTIFY_API_BASE } from "../../utils";
import { authActions, libraryActions, playlistActions } from "./actionTypes";
import { getMultipleAlbums } from "./albumActions";
import { reactotronRedux } from "reactotron-redux";

export const getAllFeaturedPlaylists = () => ({
  type: libraryActions.GET_ALL_FEATURED_PLAYLISTS,
});

export const getAllFeaturedPlaylistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(libraryActions.GET_ALL_FEATURED_PLAYLISTS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.authReducer;

      const request$ = from(
        fetch(SPOTIFY_API_BASE + "/v1/browse/featured-playlists?limit=8", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: FeaturedPlaylistsResponse | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          // const data = res.playlists.items.map(item => {
          //   return { name: item.name, url: item.images[0].url };
          // });

          const playlistIds = res.playlists.items.map(item => item.id);

          return getPlayListCoverById(playlistIds);
        }),
        catchError(err => {
          if (err.includes("expired")) {
            return of({
              type: authActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.authReducer.refreshToken,
                actionToRestart: getAllFeaturedPlaylists(),
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: libraryActions.GET_ALL_FEATURED_PLAYLISTS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );

export const getCurrentUserTopArtists = () => ({
  type: libraryActions.GET_USER_TOP_ARTISTS,
});

export const getCurrentUserTopArtistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(libraryActions.GET_USER_TOP_ARTISTS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.authReducer;

      const request$ = from(
        fetch(SPOTIFY_API_BASE + "/v1/me/top/artists?limit=19", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: UserTopArtistsResponse | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          const artists = res.items.map(item => {
            return { name: item.name, url: item.images[0].url };
          });

          const data = artists.slice(1, artists.length);
          const header = artists[0];

          return {
            type: libraryActions.GET_USER_TOP_ARTISTS_SUCCESS,
            payload: { data, header },
          };
        }),
        catchError(err => {
          if (err.includes("expired")) {
            return of({
              type: authActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.authReducer.refreshToken,
                actionToRestart: getCurrentUserTopArtists(),
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: libraryActions.GET_USER_TOP_ARTISTS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );

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
    switchMap(([, { authReducer }]: any) => {
      const { token } = authReducer;

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
        map((res: Playlists | ErrorResponse) => {
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
