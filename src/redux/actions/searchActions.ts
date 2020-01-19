import { searchActions } from "./actionTypes";
import { Observable, of } from "rxjs";
import { RootStoreType } from "../reducers";
import { ofType } from "redux-observable";
import { withLatestFrom, switchMap, debounceTime } from "rxjs/operators";
import { Action } from "../../data/models";

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

      console.log(query);

      return of({ type: "" });
    }),
  );
