import { ActionsObservable, ofType } from "redux-observable";
import { map } from "rxjs/operators";
import { Action } from "../../data/types";
import { authActions, loadingActions } from "./actionTypes";

export const loadingEpic = (action$: ActionsObservable<Action<any>>) =>
  action$.pipe(
    ofType(authActions.GET_TOKENS_SUCCESS),
    map(() => ({
      type: loadingActions.LOADING,
    })),
  );

export const doneEpic = (action$: ActionsObservable<Action<any>>) =>
  action$.pipe(
    ofType(authActions.PROFILE_SUCCESS),
    map(() => ({
      type: loadingActions.DONE,
    })),
  );
