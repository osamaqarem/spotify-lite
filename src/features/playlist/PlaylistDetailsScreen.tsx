import React from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { COLORS, ratio } from "../../utils";
import AlbumCover from "./AlbumCover";
import DownloadHeader from "./DownloadHeader";
import PlayListDetailsHeader from "./PlayListDetailsHeader";
import ShuffleButton from "./ShuffleButton";
import Track from "./Track";

export const HEADER_HEIGHT = 90;
export const ICON_SIZE = 20 * ratio;

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

const PlaylistDetailsScreen = () => {
  const offsetY = new Animated.Value(0);

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

  const translateScroll = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, HEADER_HEIGHT],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  // useEffect(() => {
  //   const test = async () => {
  //     await colorsFromUrl(
  //       "https://source.unsplash.com/random/800x600",
  //       (err: any, colors: any) => {
  //         // TODO: set lineargradient color from URL
  //         console.log(JSON.stringify(colors));
  //       },
  //     );
  //   };

  //   test();
  // }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <PlayListDetailsHeader />
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
          colors={["#8A425A", COLORS.background]}
          style={styles.gradient}></LinearGradient>
      </Animated.View>
      <View style={styles.coverContainer}>
        <AlbumCover offsetY={offsetY} />
      </View>
      <ShuffleButton offsetY={offsetY} />
      <Animated.ScrollView
        bounces={false}
        decelerationRate={0.994}
        overScrollMode="never"
        onScroll={onScroll({ y: offsetY })}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        style={[{ transform: [{ translateY: translateScroll }] }]}
        contentContainerStyle={styles.scrollContent}>
        <PlaylistContent />
      </Animated.ScrollView>
    </View>
  );
};

const PlaylistContent = () => (
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
      {albumData.map((track, index) => (
        <Track key={index} title={track.name} artist={track.artist} />
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

const albumData = [
  { name: "Be on My Side", artist: "Kip Nelson" },
  { name: "Personal", artist: "Blue Material" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Last", artist: "Babe Rainbow" },
];

export default PlaylistDetailsScreen;
