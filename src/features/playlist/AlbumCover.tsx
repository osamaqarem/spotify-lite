import React from "react";
import { View, Text } from "react-native";
import { HEADER_HEIGHT } from "./PlaylistDetailsScreen";
import FastImage from "react-native-fast-image";
import { COLORS } from "../../utils";
import Animated from "react-native-reanimated";

const cover = { url: require("../../data/assets/exampleCover.jpg") };

const AlbumCover = ({ offsetY }: { offsetY: Animated.Value<number> }) => {
  const opacityAnim = offsetY.interpolate({
    inputRange: [0, 100, 300],
    outputRange: [1, 0.1, 0],
  });

  const scaleAnim = offsetY.interpolate({
    inputRange: [0, 250, 300],
    outputRange: [1, 0.9, 0.5],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  return (
    <Animated.View
      style={{
        marginTop: 16 + HEADER_HEIGHT,
        alignItems: "center",
        opacity: opacityAnim,
        transform: [{ scaleX: scaleAnim }, { scaleY: scaleAnim }],
      }}>
      <FastImage
        style={{
          height: 175,
          width: 175,
        }}
        source={cover.url}
      />
      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 18,
            fontWeight: "bold",
            letterSpacing: 0.6,
          }}>
          Psyche Pop & Surf Rock
        </Text>
        <Text
          style={{
            marginTop: 5,
            color: COLORS.grey,
            fontSize: 14,
            letterSpacing: 0.6,
          }}>
          by Delicieuse Musique
        </Text>
      </View>
    </Animated.View>
  );
};
export default AlbumCover;
