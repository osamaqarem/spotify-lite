import reactotron from "reactotron-react-native";
import { ActionsObservable, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { Action, ErrorResponse } from "../../data/models";
import { UserProfileResponse } from "../../data/models/UserProfileResponse";
import { SPOTIFY_API_BASE } from "../../utils";
import { userActions } from "./actionTypes";

export const rehydrate = () => ({ type: userActions.REHYDRATE_FROM_API });

export const setToken = (token: string): Action<string> => ({
  type: userActions.GET_TOKENS_SUCCESS,
  payload: token,
});

export const getProfileEpic = (action$: ActionsObservable<Action<string>>) =>
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
          return of({ type: userActions.ERROR, payload: { err } });
        }),
      );
    }),
  );
