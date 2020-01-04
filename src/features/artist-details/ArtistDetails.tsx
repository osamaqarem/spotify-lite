import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { SafeAreaView, NavigationEvents } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { from, Subscription, zip } from "rxjs";
import { switchMap } from "rxjs/operators";
import ArtistCover from "../../components/ArtistCover";
import DetailsCover from "../../components/DetailsCover";
import ListOfTracks from "../../components/ListOfTracks";
import PlaylistHeaderControl from "../../components/PlaylistHeaderControl";
import PlaylistTitle, { HEADER_HEIGHT } from "../../components/PlaylistTitle";
import ShuffleButton from "../../components/ShuffleButton";
import {
  AlbumType,
  Artist,
  ArtistTopTracksResponse,
  ErrorResponse,
} from "../../data/models";
import usePlaylistAnim from "../../hooks/usePlaylistAnim";
import { redoLogin, setArtistId } from "../../redux/actions";
import {
  PlaylistDetailsType,
  TrackType,
} from "../../redux/reducers/playlistReducer";
import { RootStoreType } from "../../redux/reducers";
import { COLORS, isIphoneX, Routes, SPOTIFY_API_BASE } from "../../utils";

const onScroll = (contentOffset: {
  x?: Animated.Node<number>;
  y?: Animated.Node<number>;
}) =>
  Animated.event([
    {
      nativeEvent: {
        contentOffset,
      },
    },
  ]);

const LoadingView = () => (
  <ActivityIndicator
    size={50}
    color={COLORS.green}
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  />
);

type ArtistDetails = PlaylistDetailsType & { relatedArtists: AlbumType[] };

const ArtistDetails = ({
  artistId,
  setArtistId,
  navigation,
  token,
  profile,
  redoLogin,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current;
  const { heightAnim, opacityAnim, translateAnim } = usePlaylistAnim(offsetY);
  const [dominantColor, setDominantColor] = useState(COLORS.background);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollViewHeight, setScrollViewHeight] = useState<number>(100);
  const [artistDetails, setArtistDetails] = useState<null | ArtistDetails>(
    null,
  );

  // fetch data
  useEffect(() => {
    let subscription: Subscription | undefined;

    const fetchData = async () => {
      try {
        const artist$ = from(
          fetch(`${SPOTIFY_API_BASE}/artists/${artistId}`, {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }),
        ).pipe(switchMap(res => res.json()));

        const topTracks$ = from(
          fetch(
            `${SPOTIFY_API_BASE}/artists/${artistId}/top-tracks?market=${profile?.country}`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
          ),
        ).pipe(switchMap(res => res.json()));

        const relatedArtists$ = from(
          fetch(`${SPOTIFY_API_BASE}/artists/${artistId}/related-artists`, {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }),
        ).pipe(switchMap(res => res.json()));

        subscription = zip(artist$, topTracks$, relatedArtists$).subscribe(
          ([artist, topTracks, relatedArtistsList]: [
            Artist | ErrorResponse,
            ArtistTopTracksResponse | ErrorResponse,
            { artists: Artist[] } | ErrorResponse,
          ]) => {
            if ("error" in artist) {
              throw artist.error.message;
            }
            if ("error" in topTracks) {
              throw topTracks.error.message;
            }
            if ("error" in relatedArtistsList) {
              throw relatedArtistsList.error.message;
            }

            const tracks: TrackType[] = topTracks.tracks.map(item => ({
              artistName:
                item.artists[0].name ?? "No track returned by spotify :(",
              name: item.name ?? "No track",
            }));

            const relatedArtists: AlbumType[] = relatedArtistsList.artists.map(
              artist => ({
                name: artist.name,
                url: artist.images[0]?.url,
                id: artist.id,
              }),
            );

            setArtistDetails({
              imageUrl: artist.images[0].url,
              name: artist.name,
              ownerName: artist.name,
              tracks,
              relatedArtists,
            });

            if (Platform.OS === "android") {
              colorsFromUrl(artist.images[0].url, (err: any, colors: any) => {
                if (!err) {
                  setDominantColor(colors.averageColor);
                  setIsLoading(false);
                }
              });
            } else {
              setDominantColor(COLORS.tabBar);
              setIsLoading(false);
            }
          },
        );
      } catch (err) {
        if (err.message.includes("expired")) {
          redoLogin();
        } else {
          console.warn(err);
        }
      }
    };

    // only run the effect if details are currently null
    if (!artistDetails) {
      fetchData();
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [token, artistId, artistDetails, profile, redoLogin]);

  const goToArtist = (id: string) => {
    setArtistId(id);
    navigation.push(Routes.AppTabs.HomeStack.ArtistDetails);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <NavigationEvents
        onWillFocus={() => StatusBar.setBarStyle("light-content")}
      />
      <PlaylistHeaderControl
        goBack={() => navigation.goBack()}
        isLoading={isLoading}
      />
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <PlaylistTitle name={artistDetails?.name} />
          <Animated.View
            style={[
              styles.gradientContainer,
              {
                height: Animated.concat(heightAnim, "%"),
                opacity: opacityAnim,
              },
            ]}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              // end={{ x: 0, y: 0.9 }}
              end={{ x: 0, y: 0.7 }}
              colors={[dominantColor, COLORS.background]}
              style={styles.gradient}
            />
          </Animated.View>
          <View style={styles.coverContainer}>
            <DetailsCover
              coverShape="CIRCLE"
              offsetY={offsetY}
              name={artistDetails?.name}
              imageUrl={artistDetails?.imageUrl}
              artistName={artistDetails?.ownerName}
            />
          </View>
          <ShuffleButton
            offsetY={offsetY}
            scrollViewHeight={scrollViewHeight}
          />
          <Animated.ScrollView
            onLayout={e => setScrollViewHeight(e.nativeEvent.layout.height)}
            bounces={false}
            decelerationRate={0.994}
            overScrollMode="never"
            onScroll={onScroll({ y: offsetY })}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            style={[{ transform: [{ translateY: translateAnim }] }]}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: scrollViewHeight * 0.85,
              },
            ]}>
            {artistDetails && (
              <ListOfTracks
                playlistDetails={artistDetails}
                showDownload={false}
              />
            )}
            <Text style={[styles.relatedArtists]}>Related artists</Text>
            {artistDetails && (
              <ScrollView
                horizontal
                style={{
                  marginTop: 12,
                }}
                contentContainerStyle={{
                  paddingBottom: 30,
                }}
                showsVerticalScrollIndicator={false}>
                {artistDetails.relatedArtists.map(artist => (
                  <ArtistCover
                    coverShape="CIRCLE"
                    key={artist.id}
                    onPress={() => goToArtist(artist.id)}
                    album={{
                      id: artist.id,
                      name: artist.name,
                      url: artist.url,
                    }}
                  />
                ))}
              </ScrollView>
            )}
          </Animated.ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    alignSelf: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    alignSelf: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
  coverContainer: {
    ...StyleSheet.absoluteFillObject,
    marginTop: isIphoneX() ? -10 : -50,
    top: HEADER_HEIGHT,
  },
  scrollContent: {
    marginTop: 350,
    zIndex: 5,
  },
  relatedArtists: {
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 18.5,
    marginTop: 24,
  },
});

const mapStateToProps = (state: RootStoreType) => ({
  artistId: state.artistReducer.artistId,
  token: state.userReducer.token,
  profile: state.userReducer.profile,
});

const mapDispatchToProps = {
  setArtistId,
  redoLogin,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ArtistDetails);
