import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { Action, ErrorResponse } from "../../data/models";
import { UserProfileResponse } from "../../data/models/UserProfileResponse";
import { SPOTIFY_API_BASE } from "../../utils";
import { RootStoreType } from "../reducers";
import { globalActions, userActions } from "./actionTypes";

/**
 * Observed by:
 * {@link getProfileEpic}
 */
export const setToken = (token: string): Action<string> => ({
  type: userActions.GET_TOKENS_SUCCESS,
  payload: token,
});

export const getProfileEpic = (action$: Observable<Action<string>>) =>
  action$.pipe(
    ofType(userActions.GET_TOKENS_SUCCESS),
    switchMap(({ payload: token }) => {
      const request$ = from(
        fetch(`${SPOTIFY_API_BASE}/me`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );
      return request$.pipe(
        switchMap(res => res.json()),
        map((res: UserProfileResponse | ErrorResponse) => {
          if ("error" in res) throw res.error.message;
          return {
            type: userActions.GET_PROFILE_SUCCESS,
            payload: res,
          };
        }),
        catchError((err: string) => {
          reactotron.log(JSON.stringify(err));
          return of({ type: userActions.GET_PROFILE_ERROR, payload: { err } });
        }),
      );
    }),
  );

/**
 * Observed by:
 * {@link getAllFeaturedPlaylistsEpic}
 * {@link getCurrentUserTopArtistsEpic}
 * {@link getRecentlyPlayedTracksEpic}
 * {@link restartActionsEpic}
 */
export const rehydrate = () => ({ type: globalActions.REHYDRATE_FROM_API });

/**
 * After restarting actions, this epic will clear the actions to restart.
 */
export const restartActionsEpic = (
  actions$: Observable<Action<null>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(globalActions.REHYDRATE_FROM_API),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      from([...state.userReducer.actionsToRestart, clearActionsToRestart()]),
    ),
    map(action => action),
  );

export const clearActionsToRestart = () => ({
  type: globalActions.CLEAR_ACTIONS_TO_RESTART,
});

export const redoLogin = () => ({ type: userActions.REDO_LOGIN });
