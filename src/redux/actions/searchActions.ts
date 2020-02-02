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
import { RecentlyPlayedResponse } from "../../data/models/spotify";
import { REST_API } from "../../utils/constants";
import APIHelper from "../../utils/helpers/APIHelper";
import { Action, RootStoreType } from "../types";
import { searchActions } from "./actionTypes";

export const searchForQuery = (query: string) => ({
  type: searchActions.SEARCH_FOR_QUERY,
  payload: query,
});

export const searchForQueryEpic = (
  actions$: Observable<Action<string>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(searchActions.SEARCH_FOR_QUERY),
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
        APIHelper.handleCommonResponse<RecentlyPlayedResponse>(),
        map(data => {
          return {
            type: searchActions.SEARCH_FOR_QUERY_SUCCESS,
            payload: "success",
          };
        }),
        catchError((err: Error) => {
          reactotron.log(err.message);
          return of({
            type: searchActions.SEARCH_FOR_QUERY_ERROR,
            payload: err.message,
          });
        }),
      );
    }),
  );
