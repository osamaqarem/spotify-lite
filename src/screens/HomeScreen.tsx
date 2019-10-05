import React, {useEffect, useRef, useState} from "react";
import {WebViewNavigation} from "react-native-webview";
import {Subject} from "rxjs";
import {filter, take} from "rxjs/operators";
import Home from "../components/Home/Home";
import {madeForYou, recentlyPlayed, recommendedForYou} from "../data/home";
import {connect} from "react-redux";
import {getToken} from "../redux/actions";
import {GetToken} from "../data/types";

// TODO:
// 1- Loading reducer and epic.
// 2- HomeScreen will be injected with redux loading state and user data.
// 3- HomeScreen will pass loading prop to its presentational components,
// 4- LoginModal will be replaced with null when loading is complete.
// 5- Remove local loading state from HomeScreen.
// 6- Store access and refresh tokens in AsyncStorage.
// 7- Retrieve tokens from asyncstorage on app load at App.js.
// 8- Use stored token to retrieve user profile.
// 9- if the response is
/**
 *```js
 * "error": {
 *   "status": 401,
 *   "message": "The access token expired"
 * }
 *```
 */
//  Then a request for a new token is dispatched
// 10- API Error handling.

/**
 * Flow:
 * 1- Open app.
 * 2- App tries to get data user with stored token (is now loading).
 * 3- OK (is now not loading).            3- Fail => Get new token (is now not loading).
 * 4- user data injected into home screen.
 * 5- HomeScreen sees injected user data => hides LoginModal.
 * 6- The user is now on the HomeScreen.
 * 7- Get albums and playlists etc. through API and handle local loading state.
 *
 */

// Handling webview navigation events this way,
// because it fires 2-3 events with the SAME URL and we only want 1 event.
// Otherwise, getToken() action would be called more than once
const webViewSub$: Subject<string> = new Subject();

// Pulls the URL with the authorization code from the stream
const webView$ = webViewSub$.pipe(
  filter(v => v.includes("?code=")),
  take(1),
);

const HomeScreen = ({
  getToken,
  loading = true,
}: {
  getToken: GetToken;
  loading: boolean;
}) => {
  // TODO: The modal is always visible, but this should decide if the modal is rendered, or null.
  const [isVisible, setIsVisible] = useState(true);
  const webViewRef = useRef(null);

  /**
   * Subscribes to our navigation URL event stream
   */
  useEffect(() => {
    webView$.subscribe(handleNav);
    // eslint-disable-next-line
  }, []);

  /**
   *
   * Feed URL values to the stream on every URL change
   */
  const pushNavEvent = (e: WebViewNavigation) => {
    webViewSub$.next(e.url);
  };

  /**
   *
   * Receives the URL with the authorization code
   */
  const handleNav = (url: string) => {
    const [, authCode] = url.split("?code=");

    getToken({authCode});
  };

  const loginModalProps = {
    isVisible,
    webViewRef,
    pushNavEvent,
    isLoading: loading,
  };

  return (
    <Home
      data={{
        madeForYou,
        recentlyPlayed,
        recommendedForYou,
        loginModalProps,
      }}
    />
  );
};

const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  {getToken},
)(HomeScreen);
