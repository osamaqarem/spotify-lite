import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { Action, ErrorResponse } from "../../data/models";
import { UserProfileResponse } from "../../data/models/UserProfileResponse";
import { SPOTIFY_API_BASE } from "../../utils";
import { RootStoreType } from "../store";
import { globalActions, userActions } from "./actionTypes";

export const setToken = (token: string): Action<string> => ({
  type: userActions.GET_TOKENS_SUCCESS,
  payload: token,
});

export const getProfileEpic = (action$: Observable<Action<string>>) =>
  action$.pipe(
    ofType(userActions.GET_TOKENS_SUCCESS),
    switchMap(({ payload: token }) => {
      const request$ = from(
        fetch(`${SPOTIFY_API_BASE}/v1/me`, {
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

export const rehydrateAndRestartActions = () => ({
  type: globalActions.RESTART_ACTIONS,
});

export const rehydrateAndRestartActionsEpic = (
  actions$: Observable<Action<null>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(globalActions.RESTART_ACTIONS),
    withLatestFrom(state$),
    switchMap(([, state]) => from(state.userReducer.actionsToRestart)),
    map(action => action),
  );

export const redoLogin = () => ({ type: userActions.REDO_LOGIN });
