import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { concat, from, Observable, of } from "rxjs";
import {
  catchError,
  debounceTime,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { Action, RootStoreType } from "../../data/models/redux";
import { AlbumType, SearchResponse } from "../../data/models/spotify";
import { REST_API } from "../../utils/constants";
import APIHelper from "../../utils/helpers/APIHelper";
import { ResultKey, SearchResult } from "../reducers/searchReducer";
import { searchActions } from "./actionTypes";

export const searchForQuery = (query: string) => ({
  type: searchActions.QUERY,
  payload: query,
});

export const searchForQueryEpic = (
  actions$: Observable<Action<string>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(searchActions.QUERY),
    debounceTime(500),
    withLatestFrom(state$),
    switchMap(([action, { userReducer }]) => {
      const { payload: query } = action;
      const { token } = userReducer;

      const request$ = from(
        fetch(REST_API.search(`"${query}"`), {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      ).pipe(
        APIHelper.handleCommonResponse<SearchResponse>(),
        map(data => {
          const albumsEmpty = data.albums.items.length === 0;
          const tracksEmpty = data.tracks.items.length === 0;
          const playlistsEmpty = data.playlists.items.length === 0;
          const artistsEmpty = data.artists.items.length === 0;

          if (albumsEmpty && tracksEmpty && playlistsEmpty && artistsEmpty) {
            return of({ type: searchActions.QUERY_EMPTY, payload: query });
          }

          // select up to 7 items
          const results: SearchResult = {
            albums: data.albums.items.map(item => ({
              name: item.name,
              imageURL: item.images[0]?.url,
              id: item.id,
              type: "Album",
            })),
            tracks: data.tracks.items.map(item => ({
              name: item.name,
              imageURL: item.album.images[0]?.url,
              id: item.id,
              type: "Song",
              artist: item.artists[0].name,
            })),
            artists: data.artists.items.map(item => ({
              name: item.name,
              imageURL: item.images[0]?.url,
              id: item.id,
              type: "Artist",
            })),
            playlists: data.playlists.items.map(item => ({
              name: item.name,
              imageURL: item.images[0]?.url,
              id: item.id,
              type: "Playlist",
            })),
            random: [],
          };

          const resultsHave = {
            havePlaylists: data.playlists.items.length > 0,
            haveAlbums: data.albums.items.length > 0,
            haveTracks: data.tracks.items.length > 0,
            haveArtists: data.artists.items.length > 0,
          };

          const keyList: ResultKey[] = [
            "albums",
            "artists",
            "playlists",
            "tracks",
          ];

          let randomItemsArray: AlbumType[] = [];

          // Get random item from a random array, until we have 7 items.
          for (let i = 0; i < 7; i++) {
            const randomKey =
              keyList[Math.floor(Math.random() * keyList.length)];

            const randomArray = results[randomKey];

            const randomItem =
              randomArray[Math.floor(Math.random() * randomArray.length)];

            randomItemsArray.push(randomItem);
          }

          // 1- If some response data is empty, randomItem could be undefined.
          // 2- Create a Set to get rid of duplicates.
          results.random = [...new Set(randomItemsArray)].filter(
            item => typeof item != "undefined",
          );

          return of({
            type: searchActions.QUERY_SUCCESS,
            payload: { results, resultsHave },
          });
        }),
        mergeMap(a => a),
        catchError((err: Error) => {
          reactotron.log(err.message);
          return of({
            type: searchActions.QUERY_ERROR,
            payload: err.message,
          });
        }),
      );
      return concat(of({ type: searchActions.QUERY_LOADING }), request$);
    }),
  );
