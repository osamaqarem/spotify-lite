import React from "react";
import { Text, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { COLORS } from "../../utils";

export const cover = { url: require("../../data/assets/exampleCover.jpg") };

const AlbumCover = ({ offsetY }: { offsetY: Animated.Value<number> }) => {
  const scaleAnim = offsetY.interpolate({
    inputRange: [0, 250],
    outputRange: [1, 0.9],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const opacityAnim = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scaleX: scaleAnim }, { scaleY: scaleAnim }],
        },
      ]}>
      <FastImage style={styles.cover} source={cover.url} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Psyche Pop & Surf Rock</Text>
        <Text style={styles.artist}>by Delicieuse Musique</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  cover: {
    marginTop: 16,
    height: 165,
    width: 165,
  },
  textContainer: { marginTop: 20, alignItems: "center" },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.6,
  },
  artist: {
    marginTop: 5,
    color: COLORS.grey,
    fontSize: 14,
    letterSpacing: 0.6,
  },
});

export default AlbumCover;
