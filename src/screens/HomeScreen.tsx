import React, { useEffect, useRef, useState } from "react";
import { WebViewNavigation } from "react-native-webview";
import { connect } from "react-redux";
import { Subject } from "rxjs";
import { debounceTime, filter, take } from "rxjs/operators";
import Home from "../components/Home/Home";
import { GetToken as GetTokens, ProfileResponse } from "../data/types";
import { getProfile, getTokens, setTokens } from "../redux/actions";
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

type HomeScreenProps = {
  getTokens: GetTokens;
  // token: string | null;
  // loading: boolean; // Controls loading indicator for LoginModal
  profile: ProfileResponse | null; // Not loading once this is non-null
  getProfile: () => void;
  setTokens: ({
    token,
    refreshToken,
  }: {
    token: string;
    refreshToken: string;
  }) => {};
  recentlyPlayedAlbums: [{ name: string; url: string }];
  featuredPlaylists: [{ name: string; url: string }];
  userTopArtists: [{ name: string; url: string }];
  userTopArtistsHeader: { name: string; url: string };
};

const HomeScreen = ({
  getTokens,
  profile,
  getProfile,
  setTokens,
  recentlyPlayedAlbums,
  featuredPlaylists,
  userTopArtists,
  userTopArtistsHeader,
}: HomeScreenProps) => {
  // Visibility of LoginModal
  const [isVisible, setIsVisible] = useState(true);
  const [authCode, setAuthCode] = useState("");

  const [loading, setLoading] = useState(false);

  // Controls loading indicator in Home tab
  // const [loadingAlbums, setLoadingAlbums] = useState(true);

  const webViewRef = useRef(null);
  const webViewSub$: React.MutableRefObject<Subject<string>> = useRef(
    new Subject(),
  );

  /**
   * Subscribes to our navigation URL event stream.
   */
  useEffect(() => {
    // Handling webview navigation events this way,
    // because it fires 2-3 events with the SAME URL and we only want 1 event.
    // Otherwise, getToken() action would be called more than once
    // const webViewSub$: Subject<string> = new Subject();

    // Pulls the URL with the authorization code from the stream
    const webView$ = webViewSub$.current.pipe(
      filter(v => v.includes("?code=")),
      debounceTime(500), // The first few codes are incorrect. Take the last one.
      take(1),
    );

    const sub = webView$.subscribe(handleNav);
    return () => {
      sub.unsubscribe();
    };
  }, []);

  /**
   * Init tokens from AsyncStorage and dispatch them to redux store.
   * If tokens exist, user profile action is dispatched.
   * If profile already in redux store: Dont do anything, just hide the modal.
   */
  useEffect(() => {
    const initTokens = async () => {
      const refreshToken = await getToken("refreshToken");
      const token = await getToken("token");

      if (token && refreshToken) {
        setTokens({ token, refreshToken });
        getProfile();
      } else {
        // if there is no profile and authCode changed, this will run
        if (authCode.length > 0) {
          // getTokens automatically does getProfile when done
          getTokens({ authCode });
        }
      }
    };
    // if profile not already retrieved
    if (!profile) {
      initTokens();
    } else {
      // hide modal
      setIsVisible(false);
    }
  }, [setTokens, getProfile, getTokens, authCode, profile]);

  /**
   *
   * Feed URL values to the stream on every URL change
   */
  const pushNavEvent = (e: WebViewNavigation) => {
    webViewSub$.current.next(e.url);
  };

  /**
   *
   * Receives the URL with the authorization code
   */
  const handleNav = (url: string) => {
    setLoading(true);
    const [, authCode] = url.split("?code=");
    // Don't know why "#_=_" is at the end. Has to be removed
    const fixed = authCode.replace("#_=_", "");
    setAuthCode(fixed);
  };

  const loginModalProps = {
    webViewRef,
    pushNavEvent,
    isLoading: loading,
  };

  return (
    <Home
      data={{
        isVisible,
        loginModalProps,
        recentlyPlayedAlbums,
        featuredPlaylists,
        userTopArtists,
        userTopArtistsHeader,
      }}
    />
  );
};

const mapStateToProps = (state: any) => ({
  profile: state.authReducer.profile,
  loading: state.loadingReducer.loading,
  recentlyPlayedAlbums: state.albumReducer.recentlyPlayedAlbums,
  featuredPlaylists: state.libraryReducer.featuredPlaylists,
  userTopArtists: state.libraryReducer.userTopArtists,
  userTopArtistsHeader: state.libraryReducer.userTopArtistsHeader,
});

export default connect(
  mapStateToProps,
  { getTokens, getProfile, setTokens },
)(HomeScreen);
