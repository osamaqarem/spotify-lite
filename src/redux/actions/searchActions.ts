import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { concat, EMPTY, from, Observable, of, timer } from "rxjs";
import {
  catchError,
  debounce,
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
    debounce(action => {
      return action.payload?.length === 0 ? EMPTY : timer(500);
    }),
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
          if (queryResponseIsEmpty(data)) {
            return of({ type: searchActions.QUERY_EMPTY, payload: query });
          }

          const results = prepareSearchResults(data);
          const resultsHave = getResultsHave(data);
          const topSearchResults = sortByMostPopular(results);

          results.random = sortBySongAndArtistFirst(topSearchResults);

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

export const saveQuery = (item: AlbumType) => ({
  type: searchActions.QUERY_SAVE,
  payload: item,
});

export const deleteQuery = (item: AlbumType) => ({
  type: searchActions.QUERY_DELETE,
  payload: item,
});

const queryResponseIsEmpty = (data: SearchResponse) => {
  const albumsEmpty = data.albums.items.length === 0;
  const tracksEmpty = data.tracks.items.length === 0;
  const playlistsEmpty = data.playlists.items.length === 0;
  const artistsEmpty = data.artists.items.length === 0;

  if (albumsEmpty && tracksEmpty && playlistsEmpty && artistsEmpty) {
    return true;
  } else {
    return false;
  }
};

const prepareSearchResults = (data: SearchResponse) => {
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
      popularity: item.popularity,
    })),
    artists: data.artists.items.map(item => ({
      name: item.name,
      imageURL: item.images[0]?.url,
      id: item.id,
      type: "Artist",
      popularity: item.popularity,
    })),
    playlists: data.playlists.items.map(item => ({
      name: item.name,
      imageURL: item.images[0]?.url,
      id: item.id,
      type: "Playlist",
    })),
    random: [],
  };

  return results;
};

const getResultsHave = (data: SearchResponse) => {
  return {
    havePlaylists: data.playlists.items.length > 0,
    haveAlbums: data.albums.items.length > 0,
    haveTracks: data.tracks.items.length > 0,
    haveArtists: data.artists.items.length > 0,
  };
};

const sortByMostPopular = (results: SearchResult) => {
  const keyList: ResultKey[] = ["albums", "artists", "playlists", "tracks"];

  // Number of items that will be initially displayed in the UI (results.random)
  const TOP_RESULTS_COUNT = 7;

  // attempts must be >= TOP_RESULTS_COUNT
  // higher -> longer processing time, but more likely to populate all 7 values
  // lower -> shorter processing time, but less likely to populate all 7 values
  const ATTEMPTS = 50;
  let topSearchResults: AlbumType[] = [];

  // Get random item from a random array, until we have 7 items.
  for (let i = 0; i < ATTEMPTS; i++) {
    if (topSearchResults.length === TOP_RESULTS_COUNT) break;

    const randomKey = keyList[Math.floor(Math.random() * keyList.length)];

    const randomArray = results[randomKey];

    if (
      (randomKey === "artists" || randomKey === "tracks") &&
      randomArray.length > 0
    ) {
      const mostPopular = randomArray.reduce((prev, current) => {
        const notPreviouslyAdded =
          topSearchResults.findIndex(item => item.id === current.id) === -1;

        if (!notPreviouslyAdded) return prev;

        if (prev.popularity! > current.popularity!) {
          return prev;
        } else {
          return current;
        }
      });

      // In case artists or tracks key was randomly selected again, then we can still have duplicates
      const notPreviouslyAdded =
        topSearchResults.findIndex(item => item.id === mostPopular.id) === -1;

      if (notPreviouslyAdded) {
        topSearchResults.push(mostPopular);
      }
    } else {
      for (let j = 0; j < randomArray.length; j++) {
        // for playlists and albums the results with the lowest index tend to be the most correct.
        const randomItem = randomArray[j];

        const notPreviouslyAdded =
          topSearchResults.findIndex(item => item.id === randomItem.id) === -1;

        if (notPreviouslyAdded) {
          topSearchResults.push(randomItem);
          break;
        }
      }
    }

    // If some response data is empty, randomItem could be undefined.
    topSearchResults = topSearchResults.filter(
      item => typeof item != "undefined",
    );
  }

  return topSearchResults;
};

const sortBySongAndArtistFirst = (topSearchResults: AlbumType[]) => {
  return topSearchResults.sort((firstItem, secondItem) => {
    const firstItemIsArtistOrSong =
      firstItem.type === "Song" || firstItem.type === "Artist";
    const secondItemIsArtistOrSong =
      secondItem.type === "Song" || secondItem.type === "Artist";

    if (
      (firstItemIsArtistOrSong && secondItemIsArtistOrSong) ||
      (!firstItemIsArtistOrSong && !secondItemIsArtistOrSong)
    ) {
      return 0;
    } else if (firstItemIsArtistOrSong && !secondItemIsArtistOrSong) {
      return -1;
    } else if (!firstItemIsArtistOrSong && secondItemIsArtistOrSong) {
      return 1;
    } else {
      return 0;
    }
  });
};
