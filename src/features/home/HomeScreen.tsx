import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { WebViewNavigation } from "react-native-webview";
import { connect, ConnectedProps } from "react-redux";
import { Subject } from "rxjs";
import { debounceTime, filter, map, take } from "rxjs/operators";
import { getProfile, getTokens, setTokens } from "../../redux/actions";
import { RootStoreType } from "../../redux/store";
import { COLORS, getToken } from "../../utils";
import FeaturedPlaylists from "./FeaturedPlaylists";
import LoginModal from "./LoginModal";
import RecentlyPlayed from "./RecentlyPlayed";
import { styles } from "./styles";
import TopArtists from "./TopArtists";
import TopBar from "./TopBar";

const webViewSub$: Subject<string> = new Subject();

const HomeScreen = ({
  getTokens,
  profile,
  getProfile,
  setTokens,
  loading,
}: ReduxProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [authCode, setAuthCode] = useState("");
  const webViewRef = useRef(null);

  /**
   * Subscribes to our navigation URL event stream.
   */
  // Handling webview navigation events this way,
  // because it fires 2-3 events with the SAME URL and we only want 1 event.
  // Otherwise, getToken() action would be called more than once
  useEffect(() => {
    // Pulls the URL with the authorization code from the stream
    const webView$ = webViewSub$.pipe(
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} />
      <LoginModal {...{ webViewRef, pushNavEvent, isVisible }} />
      <TopBar />
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}>
        <RecentlyPlayed />
        <FeaturedPlaylists />
        <TopArtists />
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  profile: state.userReducer.profile,
  loading: state.loadingReducer.loading,
});

const mapDispatchToProps = {
  getTokens,
  getProfile,
  setTokens,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(HomeScreen);
