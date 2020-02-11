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
import SearchHelper from "../../utils/helpers/SearchHelper";

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
          if (SearchHelper.queryResponseIsEmpty(data)) {
            return of({ type: searchActions.QUERY_EMPTY, payload: query });
          }

          const results = SearchHelper.prepareSearchResult(data);
          const resultsHave = SearchHelper.getResultsHave(data);
          const topSearchResults = SearchHelper.sortByMostPopular(results);

          results.random = SearchHelper.sortBySongAndArtistFirst(
            topSearchResults,
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
