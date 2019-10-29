import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { from, of } from "rxjs";
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { AccessTokenResponse, DispatchFun, Action } from "../../data/types";
import {
  encoded,
  getFormUrlEncoded,
  SPOTIFY_ACCOUNTS,
  SPOTIFY_API_BASE,
  SPOTIFY_REDIRECT_URI,
} from "../../utils";
import { authActions } from "./actionTypes";
import { Alert } from "react-native";
import reactotron from "reactotron-react-native";
import { getRecentlyPlayed } from "./playlistActions";
import { getAllFeaturedPlaylists } from "./libraryActions";

/**
 *
 * Get token and refresh token.
 */
export const getTokens = ({ authCode }: { authCode: string }) => async (
  dispatch: DispatchFun,
) => {
  try {
    const body = {
      code: authCode,
      // eslint-disable-next-line
      grant_type: "authorization_code",
      // eslint-disable-next-line
      redirect_uri: SPOTIFY_REDIRECT_URI,
    };

    const formBody = getFormUrlEncoded(body);

    const res = await fetch(`${SPOTIFY_ACCOUNTS}/api/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        authorization: `Basic ${encoded}`,
      },
      body: formBody,
    });

    const resJson: AccessTokenResponse = await res.json();

    if (resJson.error) {
      Alert.alert(resJson.error);
      return;
    } else {
      const token = resJson.access_token;
      const refreshToken = resJson.refresh_token;

      dispatch({
        type: authActions.GET_TOKENS_SUCCESS,
        payload: { token, refreshToken },
      });

      dispatch(getProfile());
    }
  } catch (error) {
    dispatch({
      type: authActions.ERROR,
      payload: { error },
    });
  }
};

/**
 * Trigger @epic getProfileEpic
 */
export const getProfile = () => ({
  type: authActions.GET_PROFILE,
});

/**
 * Attempts to get user profile using token.
 * If token is expired, it will trigger @epic refreshTokenEpic
 */
export const getProfileEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<any>,
) =>
  action$.pipe(
    ofType(authActions.GET_PROFILE),
    withLatestFrom(state$),
    switchMap(([, { authReducer }]) => {
      const request$ = from(
        fetch(`${SPOTIFY_API_BASE}/v1/me`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${authReducer.token}`,
          },
        }),
      );
      return request$.pipe(
        switchMap(res => res.json()),
        map((profile: any) => {
          if (profile && profile.error) {
            throw profile.error.message;
          }
          return of(
            {
              type: authActions.PROFILE_SUCCESS,
              payload: { profile },
            },
            getRecentlyPlayed(),
            getAllFeaturedPlaylists(),
          );
        }),
        mergeMap(a => a),
        catchError((err: string) => {
          if (err.includes("expired")) {
            return of({
              type: authActions.REFRESH_TOKEN,
              payload: {
                refreshToken: authReducer.refreshToken,
                actionToRestart: getProfile,
              },
            });
          }
          reactotron.log(JSON.stringify(err));
          return of({ type: authActions.ERROR, payload: { err } });
        }),
      );
    }),
  );

/**
 * Gets a new token pair using the old refresh token.
 * Calls passed action after token refresh.
 * @param payload : { refreshToken, actionToRestart }
 */
export const refreshTokenEpic = (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType(authActions.REFRESH_TOKEN),
    switchMap(({ payload }) => {
      const { refreshToken, actionToRestart } = payload;

      const body = {
        // eslint-disable-next-line
        grant_type: "refresh_token",
        // eslint-disable-next-line
        refresh_token: refreshToken,
      };

      const formBody = getFormUrlEncoded(body);

      const request$ = from(
        fetch(`${SPOTIFY_ACCOUNTS}/api/token`, {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            authorization: `Basic ${encoded}`,
          },
          body: formBody,
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        // mapTo({ type: "test" }),
        map((resJson: AccessTokenResponse) => {
          // no new refresh token
          const token = resJson.access_token;

          // Return new token and dispatch get profile epic.
          return of(
            {
              type: authActions.GET_TOKENS_SUCCESS,
              payload: { token },
            },
            actionToRestart(),
          );
        }),
        mergeMap(a => a),
        catchError(error =>
          of({ type: authActions.ERROR, payload: { error } }),
        ),
      );
    }),
  );

/**
 * Dispatched on app startup to initialize store with tokens
 * from storage.
 */
export const setTokens = ({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) => ({
  type: authActions.SET_TOKENS,
  payload: { token, refreshToken },
});
