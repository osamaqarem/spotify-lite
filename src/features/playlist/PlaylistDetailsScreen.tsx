import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { AlbumDetailsType } from "../../redux/reducers/albumReducer";
import { RootStoreType } from "../../redux/store";
import { COLORS, height, ratio } from "../../utils";
import AlbumCover from "./AlbumCover";
import DownloadHeader from "./DownloadHeader";
import PlayListDetailsHeader, { HEADER_HEIGHT } from "./PlayListDetailsHeader";
import ShuffleButton from "./ShuffleButton";
import Track from "./Track";
import usePlaylistAnim from "./usePlaylistAnim";

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

const PlaylistDetailsScreen = ({
  albumDetails,
  navigation,
}: PropsFromRedux & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current;
  const { heightAnim, opacityAnim, translateAnim } = usePlaylistAnim(offsetY);
  const [dominantColor, setDominantColor] = useState(COLORS.background);
  const [isLoading, setIsLoading] = useState(true);

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    albumDetails?.imageUrl &&
      colorsFromUrl(albumDetails?.imageUrl, (err: any, colors: any) => {
        if (!err) {
          setDominantColor(colors.averageColor);
          setIsLoading(false);
        }
      });
  }, [albumDetails?.imageUrl]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <PlayListDetailsHeader name={albumDetails?.name} goBack={goBack} />
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
            <AlbumCover
              offsetY={offsetY}
              name={albumDetails?.name}
              imageUrl={albumDetails?.imageUrl}
              artistName={albumDetails?.artistName}
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
            contentContainerStyle={styles.scrollContent}>
            {albumDetails && <PlaylistContent albumDetails={albumDetails} />}
          </Animated.ScrollView>
        </>
      )}
    </View>
  );
};

const PlaylistContent = ({
  albumDetails,
}: {
  albumDetails: AlbumDetailsType;
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
      {albumDetails.tracks.map((track, index) => (
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
    // paddingBottom: 364 * ratio,
    paddingBottom: height * 1.2,
    zIndex: 5,
  },
});

const mapStateToProps = (state: RootStoreType) => ({
  albumDetails: state.albumReducer.albumDetails,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PlaylistDetailsScreen);