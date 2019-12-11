import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StatusBar, View, YellowBox } from "react-native";
import { WebViewNavigation } from "react-native-webview";
import { NavigationTabProp } from "react-navigation-material-bottom-tabs";
import { Subject } from "rxjs";
import { debounceTime, filter, map, take } from "rxjs/operators";
import { GetTokens, UserProfileResponse, AlbumType } from "../../data/models";
import { getToken, Routes } from "../../utils";
import LoginModal from "./LoginModal";
import TopBar from "./TopBar";
import RecentlyPlayed from "./RecentlyPlayed";
import FeaturedPlaylists from "./FeaturedPlaylists";
import TopArtists from "./TopArtists";
import { connect } from "react-redux";
import {
  getTokens,
  getProfile,
  setTokens,
  getRecentlyPlayed,
  getAlbumById,
} from "../../redux/actions";
import { COLORS } from "../../utils";
import { styles } from "./styles";
import { RootStoreType } from "../../redux/store";
import AlbumRecentItem from "./AlbumRecentItem";

type HomeScreenProps = {
  getTokens: GetTokens;
  // token: string | null;
  loading: boolean; // Controls loading indicator for LoginModal
  profile: UserProfileResponse | null; // Not loading once this is non-null
  getProfile: () => void;
  getRecentlyPlayed: () => void;
  getAlbumById: (id: string) => void;
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
  navigation: NavigationTabProp;
};

const HomeScreen = ({
  getTokens,
  profile,
  getProfile,
  getRecentlyPlayed,
  getAlbumById,
  setTokens,
  recentlyPlayedAlbums,
  featuredPlaylists,
  userTopArtists,
  userTopArtistsHeader,
  loading,
  navigation,
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

  // Refetch recently played subscription
  useEffect(() => {
    // React Native complains that although the interval keeps on running in the background, it cannot be called.
    // In this particular case calling getRecentlyPlayed() when the app comes to foreground is the better UX.
    YellowBox.ignoreWarnings(["180000ms"]);

    const refetchRecentlyPlayedAlbums = setInterval(() => {
      if (recentlyPlayedAlbums) {
        getRecentlyPlayed();
      }
    }, 180 * 1000); // average song length is 3 minutes ¯\(ツ)/¯

    return () => {
      clearInterval(refetchRecentlyPlayedAlbums);
    };
  }, [getRecentlyPlayed, recentlyPlayedAlbums]);

  const fetchAlbumDetails = (id: string) => {
    getAlbumById(id);
  };

  const goToPlaylistDetails = () => {
    navigation.navigate(Routes.NestedStack.PlaylistDetailsScreen);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} />
      <LoginModal {...{ webViewRef, pushNavEvent, isVisible }} />
      <TopBar />
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}>
        <RecentlyPlayed>
          {recentlyPlayedAlbums &&
            recentlyPlayedAlbums.map((album, index: number) => (
              <AlbumRecentItem
                key={index}
                album={album}
                fetchAlbumDetails={fetchAlbumDetails}
                goToPlaylistDetails={goToPlaylistDetails}
              />
            ))}
        </RecentlyPlayed>
        <FeaturedPlaylists
          navigation={navigation}
          featuredPlaylists={featuredPlaylists}
        />
        <TopArtists
          navigation={navigation}
          userTopArtists={userTopArtists}
          userTopArtistsHeader={userTopArtistsHeader}
        />
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  profile: state.userReducer.profile,
  loading: state.loadingReducer.loading,
  recentlyPlayedAlbums: state.albumReducer.recentlyPlayedAlbums,
  featuredPlaylists: state.browseReducer.featuredPlaylists,
  userTopArtists: state.personalizationReducer.userTopArtists,
  userTopArtistsHeader: state.personalizationReducer.userTopArtistsHeader,
});

export default connect(mapStateToProps, {
  getTokens,
  getProfile,
  setTokens,
  getRecentlyPlayed,
  getAlbumById,
})(HomeScreen);