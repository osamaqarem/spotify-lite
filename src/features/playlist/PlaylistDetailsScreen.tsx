import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { AlbumDetailsType } from "../../redux/reducers/albumReducer";
import { RootStoreType } from "../../redux/store";
import { COLORS, ratio } from "../../utils";
import AlbumCover from "./AlbumCover";
import DownloadHeader from "./DownloadHeader";
import PlayListDetailsHeader, { HEADER_HEIGHT } from "./PlayListDetailsHeader";
import ShuffleButton from "./ShuffleButton";
import Track from "./Track";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";

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

const offsetY = new Animated.Value(0);

const PlaylistDetailsScreen = ({
  albumDetails,
  navigation,
}: PropsFromRedux & { navigation: NavigationStackProp }) => {
  const opacityAnim = offsetY.interpolate({
    inputRange: [0, 220],
    outputRange: [1, 0.3],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const heightAnim = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [60, 16],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const translateAnim = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, HEADER_HEIGHT],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const [dominantColor, setDominantColor] = useState(COLORS.darkWhite);

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const getColors = async () => {
      await colorsFromUrl(albumDetails?.imageUrl, (err: any, colors: any) => {
        console.log(JSON.stringify(colors));
        setDominantColor(colors.dominantColor);
      });
    };

    albumDetails?.imageUrl && getColors();
  }, [albumDetails?.imageUrl]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <PlayListDetailsHeader name={albumDetails?.name} goBack={goBack} />
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
          end={{ x: 0, y: 0.8 }}
          colors={[dominantColor, COLORS.background]}
          style={styles.gradient}></LinearGradient>
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
    paddingBottom: 364 * ratio,
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
