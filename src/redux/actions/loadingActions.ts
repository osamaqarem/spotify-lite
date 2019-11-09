import { ActionsObservable, ofType } from "redux-observable";
import { map } from "rxjs/operators";
import { Action } from "../../data/types";
import { authActions, libraryActions, loadingActions } from "./actionTypes";

export const loadingEpic = (action$: ActionsObservable<Action<any>>) =>
  action$.pipe(
    ofType(authActions.GET_PROFILE),
    map(() => ({
      type: loadingActions.LOADING,
    })),
  );

// TODO: make done based on multiple action types?
export const doneEpic = (action$: ActionsObservable<Action<any>>) =>
  action$.pipe(
    // ofType(playlistActions.RECENTLY_PLAYED_SUCCESS),
    ofType(libraryActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS),
    map(() => ({
      type: loadingActions.DONE,
    })),
  );
