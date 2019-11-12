import { ActionsObservable, ofType } from "redux-observable";
import { map } from "rxjs/operators";
import { Action } from "../../data/models";
import { loadingActions, userActions } from "./actionTypes";

export const loadingEpic = (action$: ActionsObservable<Action<any>>) =>
  action$.pipe(
    ofType(userActions.GET_PROFILE),
    map(() => ({
      type: loadingActions.LOADING,
    })),
  );

// TODO: make done based on multiple action types?
export const doneEpic = (action$: ActionsObservable<Action<any>>) =>
  action$.pipe(
    // ofType(playlistActions.RECENTLY_PLAYED_SUCCESS),
    ofType(userActions.PROFILE_SUCCESS),
    map(() => ({
      type: loadingActions.DONE,
    })),
  );
