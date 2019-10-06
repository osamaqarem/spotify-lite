import { ActionsObservable, ofType } from "redux-observable";
import { map } from "rxjs/operators";
import { DispatchObject } from "../../data/types";
import { authActions, loadingActions } from "./actionTypes";

export const loadingEpic = (action$: ActionsObservable<DispatchObject>) =>
  action$.pipe(
    ofType(authActions.GET_TOKEN_SUCCESS),
    map(() => ({
      type: loadingActions.LOADING,
    })),
  );

export const doneEpic = (action$: ActionsObservable<DispatchObject>) =>
  action$.pipe(
    ofType(authActions.PROFILE_SUCCESS),
    map(() => ({
      type: loadingActions.DONE,
    })),
  );
