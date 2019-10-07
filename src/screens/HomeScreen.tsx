import React, { useEffect, useRef, useState } from "react";
import { WebViewNavigation } from "react-native-webview";
import { connect } from "react-redux";
import { Subject } from "rxjs";
import { filter, take } from "rxjs/operators";
import Home from "../components/Home/Home";
import { madeForYou, recentlyPlayed, recommendedForYou } from "../data/home";
import { GetToken as GetTokens, ProfileResponse } from "../data/types";
import { getTokens, getProfile, setTokens } from "../redux/actions";
import { Alert } from "react-native";
import { getToken } from "../utils";

/**
 * Flow:
 * 1- Open app. App obtains auth code and checks if token exists (is now loading).
 * 2- App tries to get data user with stored token.
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

type HomeScreenProps = {
  getTokens: GetTokens;
  token: string | null;
  loading: boolean; // Controls loading indicator for LoginModal
  profile: ProfileResponse | null; // Not loading once this is non-null
  getProfile: () => void;
  setTokens: ({
    token,
    refreshToken,
  }: {
    token: string;
    refreshToken: string;
  }) => {};
};

const HomeScreen = ({
  getTokens,
  loading = true,
  profile,
  getProfile,
  setTokens,
}: HomeScreenProps) => {
  // Visibility of LoginModal
  const [isVisible, setIsVisible] = useState(true);
  const [authCode, setAuthCode] = useState("");

  // Controls loading indicator in Home tab
  const [loadingAlbums, setLoadingAlbums] = useState(true);

  const webViewRef = useRef(null);

  /**
   * Subscribes to our navigation URL event stream.
   * Init tokens from AsyncStorage and dispatch them to redux store.
   * If tokens exist, user profile action is dispatched.
   */
  useEffect(() => {
    webView$.subscribe(handleNav);

    const initTokens = async () => {
      const refreshToken = await getToken("refreshToken");
      const token = await getToken("token");

      if (token && refreshToken) {
        setTokens({ token, refreshToken });
        getProfile();
      } else {
        getTokens({ authCode });
      }
    };

    initTokens();
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

    setAuthCode(authCode);
  };

  useEffect(() => {
    if (profile) {
      setIsVisible(false);
    }
  }, [profile]);

  const loginModalProps = {
    webViewRef,
    pushNavEvent,
    isLoading: loading,
  };

  return (
    <Home
      data={{
        isVisible,
        madeForYou,
        recentlyPlayed,
        recommendedForYou,
        loginModalProps,
      }}
    />
  );
};

const mapStateToProps = (state: any) => ({
  profile: state.authReducer.profile,
  loading: state.loadingReducer.loading,
});

export default connect(
  mapStateToProps,
  { getTokens, getProfile, setTokens },
)(HomeScreen);
