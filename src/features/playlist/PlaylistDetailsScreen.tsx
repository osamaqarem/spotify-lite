import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { COLORS, ratio } from "../../utils";
import AlbumCover from "./AlbumCover";
import DownloadHeader from "./DownloadHeader";
import PlayListDetailsHeader from "./PlayListDetailsHeader";
import ShuffleButton, { BUTTON_HEIGHT } from "./ShuffleButton";
import Track from "./Track";
import LinearGradient from "react-native-linear-gradient";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";

export const HEADER_HEIGHT = 50;
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
      <PlayListDetailsHeader offsetY={offsetY} />
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
        <View style={styles.coverContent}>
          <AlbumCover offsetY={offsetY} />
        </View>
      </View>
      <ShuffleButton offsetY={offsetY} />
      <Animated.ScrollView
        overScrollMode="never"
        onScroll={onScroll({ y: offsetY })}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        style={styles.scrollContainer}
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
    alignSelf: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
    height: "60%",
  },
  coverContent: {
    alignSelf: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
  scrollContainer: { marginTop: HEADER_HEIGHT + BUTTON_HEIGHT },
  scrollContent: { marginTop: 188 * ratio, zIndex: 10 },
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
  { name: "Morning Song", artist: "Babe Rainbow" },
];

export default PlaylistDetailsScreen;
