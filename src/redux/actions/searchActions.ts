import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import {
  catchError,
  debounceTime,
  map,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { REST_API } from "../../utils/constants";
import APIHelper from "../../utils/helpers/APIHelper";
import { Action, RootStoreType } from "../../data/models/redux";
import { searchActions } from "./actionTypes";
import { SearchResponse, AlbumType } from "../../data/models/spotify";
import { SearchResult, ResultKey } from "../reducers/searchReducer";

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
        fetch(REST_API.search(query!), {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        APIHelper.handleCommonResponse<SearchResponse>(),
        map(data => {
          // select up to 7 items
          const results: SearchResult = {
            albums: data.albums.items.map(item => ({
              name: item.name,
              imageURL: item.images[0]?.url,
              id: item.id,
            })),
            tracks: data.tracks.items.map(item => ({
              name: item.name,
              imageURL: item.album.images[0]?.url,
              id: item.id,
            })),
            artists: data.artists.items.map(item => ({
              name: item.name,
              imageURL: item.images[0]?.url,
              id: item.id,
            })),
            playlists: data.playlists.items.map(item => ({
              name: item.name,
              imageURL: item.images[0]?.url,
              id: item.id,
            })),
            random: [],
          };

          const resultsHave = {
            havePlaylists: data.playlists.items.length > 0,
            haveAlbums: data.albums.items.length > 0,
            haveTracks: data.tracks.items.length > 0,
            haveArtists: data.artists.items.length > 0,
          };

          const keyList = Object.keys(results);
          let randomItemsArray: AlbumType[] = [];

          // Get random item from a random array, until we have 7 items.
          for (let i = 0; i < 7; i++) {
            const randomKey = keyList[
              Math.floor(Math.random() * keyList.length)
            ] as ResultKey;

            const randomArray = results[randomKey];

            const randomItem =
              randomArray[Math.floor(Math.random() * randomArray.length)];

            randomItemsArray.push(randomItem);
          }

          results.random = randomItemsArray;

          return {
            type: searchActions.QUERY_SUCCESS,
            payload: { results, resultsHave },
          };
        }),
        catchError((err: Error) => {
          reactotron.log(err.message);
          return of({
            type: searchActions.QUERY_ERROR,
            payload: err.message,
          });
        }),
      );
    }),
  );
