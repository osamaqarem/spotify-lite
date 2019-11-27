import reactotron from "reactotron-react-native";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { from, of } from "rxjs";
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { Action, DispatchFun, ErrorResponse } from "../../data/models";
import { AccessTokenResponse } from "../../data/models/AccessTokenResponse";
import { UserProfileResponse } from "../../data/models/UserProfileResponse";
import {
  getFormUrlEncoded,
  SPOTIFY_ACCOUNTS,
  SPOTIFY_API_BASE,
  SPOTIFY_REDIRECT_URI,
} from "../../utils";
import { userActions } from "./actionTypes";
import { getAllFeaturedPlaylists } from "./browseActions";
import { getCurrentUserTopArtists } from "./personalizationActions";
import { getRecentlyPlayed } from "./playerActions";
import { encoded } from "../../../secret";

/**
 *
 * Get token and refresh token.
 */
export const getTokens = ({ authCode }: { authCode: string }) => async (
  dispatch: DispatchFun<any>,
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

    const resJson: AccessTokenResponse | ErrorResponse = await res.json();

    if ("error" in resJson) throw resJson.error.message;

    const token = resJson.access_token;
    const refreshToken = resJson.refresh_token;

    dispatch({
      type: userActions.GET_TOKENS_SUCCESS,
      payload: { token, refreshToken },
    });

    dispatch(getProfile());
  } catch (error) {
    dispatch({
      type: userActions.ERROR,
      payload: { error },
    });
  }
};

/**
 * Trigger @epic getProfileEpic
 */
export const getProfile = () => ({
  type: userActions.GET_PROFILE,
});

/**
 * Attempts to get user profile using token.
 * If token is expired, it will trigger @epic refreshTokenEpic
 */
export const getProfileEpic = (
  action$: ActionsObservable<Action<any>>,
  state$: StateObservable<any>,
) =>
  action$.pipe(
    ofType(userActions.GET_PROFILE),
    withLatestFrom(state$),
    switchMap(([, { userReducer }]) => {
      const request$ = from(
        fetch(`${SPOTIFY_API_BASE}/v1/me`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${userReducer.token}`,
          },
        }),
      );
      return request$.pipe(
        switchMap(res => res.json()),
        map((res: UserProfileResponse | ErrorResponse) => {
          if ("error" in res) throw res.error.message;

          return of(
            {
              type: userActions.PROFILE_SUCCESS,
              payload: res,
            },
            getRecentlyPlayed(),
            getAllFeaturedPlaylists(),
            getCurrentUserTopArtists(),
          );
        }),
        mergeMap(a => a),
        catchError((err: string) => {
          if (typeof err === "string" && err.includes("expired")) {
            return of({
              type: userActions.REFRESH_TOKEN,
              payload: {
                refreshToken: userReducer.refreshToken,
                actionToRestart: getProfile,
              },
            });
          }
          reactotron.log(JSON.stringify(err));
          return of({ type: userActions.ERROR, payload: { err } });
        }),
      );
    }),
  );

/**
 * Gets a new token pair using the old refresh token.
 * Calls passed action after token refresh.
 * @param payload : { refreshToken, actionToRestart }
 */
export const refreshTokenEpic = (action$: ActionsObservable<Action<any>>) =>
  action$.pipe(
    ofType(userActions.REFRESH_TOKEN),
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
        map((resJson: AccessTokenResponse | ErrorResponse) => {
          if ("error" in resJson) throw resJson.error.message;

          // no new refresh token
          const token = resJson.access_token;

          // Return new token and dispatch get profile epic.
          return of(
            {
              type: userActions.GET_TOKENS_SUCCESS,
              payload: { token },
            },
            actionToRestart(),
          );
        }),
        mergeMap(a => a),
        catchError(error =>
          of({ type: userActions.ERROR, payload: { error } }),
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
  type: userActions.SET_TOKENS,
  payload: { token, refreshToken },
});
