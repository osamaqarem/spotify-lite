import {ActionsObservable, ofType} from "redux-observable";
import {from, of} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";
import secret from "../../../secret";
import {
  AccessTokenResponse,
  DispatchFun,
  DispatchObject,
} from "../../data/types";
import {
  Base64,
  getFormUrlEncoded,
  SPOTIFY_ACCOUNTS,
  SPOTIFY_API_BASE,
  SPOTIFY_REDIRECT_URI,
} from "../../utils";
import {authActions} from "./actionTypes";

// Flow (no errors):
// 1- getToken is dispatched
// 2- getToken dispatches GET_TOKEN
// 3- get user details epic
export const getToken = ({authCode}: {authCode: string}) => async (
  dispatch: DispatchFun,
) => {
  try {
    const encoded = Base64.btoa(secret.clientId + ":" + secret.clientSecret);

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
      type: authActions.GET_TOKEN,
      payload: {token, refreshToken},
    });
  } catch (error) {
    dispatch({
      type: authActions.ERROR,
      payload: {error},
    });
  }
};

export const getProfile = (action$: ActionsObservable<DispatchObject>) =>
  action$.pipe(
    ofType(authActions.GET_TOKEN),
    switchMap(({payload: tokens}) => {
      const request$ = from(
        fetch(`${SPOTIFY_API_BASE}/v1/me`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${tokens.token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map(profile => ({type: authActions.PROFILE, payload: {profile}})),
        catchError(error => of({type: authActions.ERROR, payload: {error}})),
      );
    }),
  );
