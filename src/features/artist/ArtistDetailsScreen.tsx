import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { from, Subscription, zip } from "rxjs";
import { switchMap } from "rxjs/operators";
import {
  AlbumType,
  Artist,
  ArtistTopTracksResponse,
  ErrorResponse,
} from "../../data/models";
import { refreshUserToken } from "../../redux/actions";
import {
  PlaylistDetailsType,
  TrackType,
} from "../../redux/reducers/playlistReducer";
import { RootStoreType } from "../../redux/store";
import { COLORS, height, ratio, SPOTIFY_API_BASE } from "../../utils";
import DetailsCover from "../common/DetailsCover";
import DetailsHeader, { HEADER_HEIGHT } from "../common/DetailsHeader";
import ShuffleButton from "../common/ShuffleButton";
import usePlaylistAnim from "../common/hooks/usePlaylistAnim";
import PlaylistContent from "../common/PlaylistContent";
import HorizontalCoverList from "../common/HorizontalCoverList";

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

const ArtistDetailsScreen = ({
  artistId,
  navigation,
  token,
  refreshUserToken,
  refreshToken,
}: PropsFromRedux & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current;
  const { heightAnim, opacityAnim, translateAnim } = usePlaylistAnim(offsetY);
  const [dominantColor, setDominantColor] = useState(COLORS.background);
  const [isLoading, setIsLoading] = useState(true);

  const [artistDetails, setArtistDetails] = useState<null | ArtistDetails>(
    null,
  );

  // fetch data
  useEffect(() => {
    let subscription: Subscription | undefined;

    const fetchData = async () => {
      try {
        const artist$ = from(
          fetch(`${SPOTIFY_API_BASE}/v1/artists/${artistId}`, {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          }),
        ).pipe(switchMap(res => res.json()));

        const topTracks$ = from(
          fetch(
            `${SPOTIFY_API_BASE}/v1/artists/${artistId}/top-tracks?market=US`,
            {
              method: "GET",
              headers: {
                authorization: `Bearer ${token}`,
              },
            },
          ),
        ).pipe(switchMap(res => res.json()));

        const relatedArtists$ = from(
          fetch(`${SPOTIFY_API_BASE}/v1/artists/${artistId}/related-artists`, {
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
                url: artist.images[0].url,
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

            colorsFromUrl(artist.images[0].url, (err: any, colors: any) => {
              if (!err) {
                setDominantColor(colors.averageColor);
                setIsLoading(false);
              }
            });
          },
        );
      } catch (err) {
        // handle error
        if (typeof err === "string" && err.includes("expired")) {
          refreshToken
            ? refreshUserToken(refreshToken)
            : console.error("ArtistDetailsScreen: Refresh token is null.");
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
  }, [refreshToken, token, artistId, refreshUserToken, artistDetails]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <DetailsHeader
        name={artistDetails?.name}
        goBack={() => navigation.goBack()}
        isLoading={isLoading}
      />
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
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
              end={{ x: 0, y: 0.9 }}
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
          <ShuffleButton offsetY={offsetY} />
          <Animated.ScrollView
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
                paddingBottom:
                  artistDetails && artistDetails.tracks.length > 8
                    ? 364 * ratio
                    : height,
              },
            ]}>
            {artistDetails && (
              <PlaylistContent
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
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <HorizontalCoverList
                    coverShape="CIRCLE"
                    key={index}
                    onPress={() => {}}
                    album={{
                      id: "",
                      name: "Example Artist",
                      url: artistDetails?.imageUrl,
                    }}
                  />
                ))}
              </ScrollView>
            )}
          </Animated.ScrollView>
        </>
      )}
    </View>
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
    height: "60%",
    top: HEADER_HEIGHT,
  },
  scrollContent: {
    marginTop: 290 * ratio,
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
  refreshToken: state.userReducer.refreshToken,
});

const mapDispatchToProps = { refreshUserToken };

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ArtistDetailsScreen);
