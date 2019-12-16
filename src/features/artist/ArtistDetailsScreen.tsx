import React, { useEffect, useRef, useState, useCallback } from "react";
import { ActivityIndicator, StyleSheet, View, BackHandler } from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../redux/store";
import { COLORS, height, ratio } from "../../utils";
import { PlaylistDetailsType } from "../../redux/reducers/playlistReducer";
import { clearPlaylistDetails } from "../../redux/actions";
import usePlaylistAnim from "../common/hooks/usePlaylistAnim";
import DetailsHeader, { HEADER_HEIGHT } from "../common/details/DetailsHeader";
import DetailsCover from "../common/details/DetailsCover";
import ShuffleButton from "../common/details/ShuffleButton";
import DownloadHeader from "../common/details/DownloadHeader";
import Track from "../common/details/Track";

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

const ArtistDetailsScreen = ({
  playlistDetails,
  clearPlaylistDetails,
  navigation,
}: PropsFromRedux & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current;
  const { heightAnim, opacityAnim, translateAnim } = usePlaylistAnim(offsetY);
  const [dominantColor, setDominantColor] = useState(COLORS.background);
  const [isLoading, setIsLoading] = useState(true);

  const goBack = useCallback(() => {
    clearPlaylistDetails();
    navigation.goBack();
    return true;
  }, [clearPlaylistDetails, navigation]);

  useEffect(() => {
    const didFocusSub = navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", goBack);

      playlistDetails?.imageUrl &&
        colorsFromUrl(playlistDetails?.imageUrl, (err: any, colors: any) => {
          if (!err) {
            setDominantColor(colors.averageColor);
            setIsLoading(false);
          }
        });
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", goBack);
      didFocusSub.remove();
    };
  }, [goBack, navigation, playlistDetails?.imageUrl]);

  // TODO: fetch data based on artist id

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <DetailsHeader
        name={playlistDetails?.name}
        goBack={goBack}
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
              offsetY={offsetY}
              name={playlistDetails?.name}
              imageUrl={playlistDetails?.imageUrl}
              artistName={playlistDetails?.ownerName}
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
                  playlistDetails && playlistDetails.tracks.length > 8
                    ? 364 * ratio
                    : height,
              },
            ]}>
            {playlistDetails && (
              <PlaylistContent playlistDetails={playlistDetails} />
            )}
          </Animated.ScrollView>
        </>
      )}
    </View>
  );
};

const PlaylistContent = ({
  playlistDetails,
}: {
  playlistDetails: PlaylistDetailsType;
}) => (
  <View
    style={{
      backgroundColor: COLORS.background,
      paddingTop: 44 * ratio,
    }}>
    <View
      style={{
        flex: 1,
        marginHorizontal: 10,
      }}>
      <DownloadHeader />
      {playlistDetails.tracks.map((track, index) => (
        <Track key={index} title={track.name} artist={track.artistName} />
      ))}
    </View>
  </View>
);

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
});

const mapStateToProps = (state: RootStoreType) => ({
  playlistDetails: state.playlistReducer.playlistDetails,
});

const mapDispatchToProps = {
  clearPlaylistDetails,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ArtistDetailsScreen);
