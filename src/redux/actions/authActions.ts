import { Alert } from "react-native";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { from, of } from "rxjs";
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs/operators";
import {
  AccessTokenResponse,
  DispatchFun,
  DispatchObject,
  ProfileError,
} from "../../data/types";
import {
  encoded,
  getFormUrlEncoded,
  SPOTIFY_ACCOUNTS,
  SPOTIFY_API_BASE,
  SPOTIFY_REDIRECT_URI,
} from "../../utils";
import { authActions } from "./actionTypes";

/**
 *
 * Get token and refresh token.
 */
export const getTokens = ({ authCode }: { authCode: string }) => async (
  dispatch: DispatchFun,
) => {
  try {
    debugger;

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

    const token = resJson.access_token;
    const refreshToken = resJson.refresh_token;

    dispatch({
      type: authActions.GET_TOKEN_SUCCESS,
      payload: { token, refreshToken },
    });

    dispatch(getProfile());
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
  action$: ActionsObservable<DispatchObject>,
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
        map(profile => ({
          type: authActions.PROFILE_SUCCESS,
          payload: { profile },
        })),
        catchError(({ error }: ProfileError) => {
          if (error.message.includes("expired")) {
            Alert.alert("Expired token");
            return of({
              type: authActions.REFRESH_TOKEN,
              payload: authReducer.refreshToken,
            });
          }
          Alert.alert("valid token. different error");
          return of({ type: authActions.ERROR, payload: { error } });
        }),
      );
    }),
  );

/**
 * Gets a new token pair using the old refresh token.
 */
export const refreshTokenEpic = (action$: ActionsObservable<DispatchObject>) =>
  action$.pipe(
    ofType(authActions.REFRESH_TOKEN),
    mergeMap(({ payload }) => {
      debugger;
      const body = {
        // eslint-disable-next-line
        grant_type: "refresh_token",
        // eslint-disable-next-line
        refresh_token: payload,
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
        take(1),
        switchMap(res => res.json()),
        map((resJson: AccessTokenResponse) => {
          const token = resJson.access_token;
          const refreshToken = resJson.refresh_token;

          // Return new token and dispatch get profile epic.
          return of(
            {
              type: authActions.GET_TOKEN_SUCCESS,
              payload: { token, refreshToken },
            },
            {
              type: authActions.GET_PROFILE,
            },
          );
        }),
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
