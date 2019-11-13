import React, { useEffect, useRef, useState } from "react";
import { WebViewNavigation } from "react-native-webview";
import { connect } from "react-redux";
import { Subject } from "rxjs";
import { debounceTime, filter, map, take } from "rxjs/operators";
import Home from "../components/Home/Home";
import { GetTokens, UserProfileResponse } from "../data/models";
import { getProfile, getTokens, setTokens } from "../redux/actions";
import { ReduxStoreType } from "../redux/reducers";
import { AlbumType } from "../redux/reducers/albumReducer";
import { getToken } from "../utils";

type HomeScreenProps = {
  getTokens: GetTokens;
  // token: string | null;
  loading: boolean; // Controls loading indicator for LoginModal
  profile: UserProfileResponse | null; // Not loading once this is non-null
  getProfile: () => void;
  setTokens: ({
    token,
    refreshToken,
  }: {
    token: string;
    refreshToken: string;
  }) => {};
  recentlyPlayedAlbums: AlbumType[];
  featuredPlaylists: AlbumType[];
  userTopArtists: AlbumType[];
  userTopArtistsHeader: AlbumType;
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
  loading,
}: HomeScreenProps) => {
  // Visibility of LoginModal
  const [isVisible, setIsVisible] = useState(true);
  const [authCode, setAuthCode] = useState("");

  const webViewRef = useRef(null);
  const webViewSub$: React.MutableRefObject<Subject<string>> = useRef(
    new Subject(),
  );

  /**
   * Subscribes to our navigation URL event stream.
   */
  // Handling webview navigation events this way,
  // because it fires 2-3 events with the SAME URL and we only want 1 event.
  // Otherwise, getToken() action would be called more than once
  useEffect(() => {
    // Pulls the URL with the authorization code from the stream
    const webView$ = webViewSub$.current.pipe(
      filter(v => v.includes("?code=")),
      debounceTime(5000), // The first few codes are incorrect. Take the last one.
      take(1),
      map(res => res.replace("#_=_", "")),
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
        debugger;

        getProfile();
      } else {
        // if there is no profile and authCode changed, this will run
        if (authCode.length > 0) {
          // getTokens automatically does getProfile when done
          debugger;
          getTokens({ authCode });
        }
      }
    };

    // if profile not already retrieved
    if (!profile && !loading) {
      initTokens();
    } else if (isVisible && !loading) {
      // hide modal
      setIsVisible(false);
    }
  }, [setTokens, getProfile, getTokens, authCode, profile, loading, isVisible]);

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
    const [, authCode] = url.split("?code=");

    setAuthCode(authCode);
  };

  const loginModalProps = {
    webViewRef,
    pushNavEvent,
    isVisible,
  };

  return (
    <Home
      {...{
        loginModalProps,
        recentlyPlayedAlbums,
        featuredPlaylists,
        userTopArtists,
        userTopArtistsHeader,
      }}
    />
  );
};

const mapStateToProps = (state: ReduxStoreType) => ({
  profile: state.userReducer.profile,
  loading: state.loadingReducer.loading,
  recentlyPlayedAlbums: state.albumReducer.recentlyPlayedAlbums,
  featuredPlaylists: state.browseReducer.featuredPlaylists,
  userTopArtists: state.personalizationReducer.userTopArtists,
  userTopArtistsHeader: state.personalizationReducer.userTopArtistsHeader,
});

export default connect(mapStateToProps, { getTokens, getProfile, setTokens })(
  HomeScreen,
);
