import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../utils";
import DotsView from "./DotsView";
import { HEADER_HEIGHT, ICON_SIZE } from "./PlaylistDetailsScreen";
import Animated from "react-native-reanimated";

const PlayListDetailsHeader = ({
  offsetY,
}: {
  offsetY: Animated.Value<number>;
}) => {
  const opacityAnim = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, 1],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: HEADER_HEIGHT,
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
      }}>
      <View
        style={{
          marginTop: 8,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}>
        <Icon
          name="arrow-left"
          size={ICON_SIZE}
          style={{
            color: COLORS.white,
            position: "absolute",
            left: 15,
          }}
        />
        <Animated.Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            letterSpacing: 0.6,
            color: COLORS.white,
            opacity: opacityAnim,
          }}>
          Psyche Pop & Surf Rock
        </Animated.Text>
        <Icon
          name={true ? "heart" : "heart-outline"} // TODO: heart
          size={ICON_SIZE}
          style={{
            color: COLORS.green,
            right: 54,
            position: "absolute",
          }}
        />
        <View
          style={{
            position: "absolute",
            right: 15,
          }}>
          <DotsView />
        </View>
      </View>
    </View>
  );
};

export default PlayListDetailsHeader;
