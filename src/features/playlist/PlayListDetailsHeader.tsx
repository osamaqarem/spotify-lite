import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, ratio, height } from "../../utils";
import DotsView from "./DotsView";
import { HEADER_HEIGHT, ICON_SIZE } from "./PlaylistDetailsScreen";

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

  const zAnim = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [-1, 3],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          zIndex: zAnim,
          opacity: opacityAnim,
        },
      ]}>
      <View style={styles.content}>
        <Icon name="arrow-left" size={ICON_SIZE} style={styles.arrowIcon} />
        <View
          style={{
            width: "54%",
          }}>
          <Animated.Text numberOfLines={1} style={[styles.title, {}]}>
            Psyche Pop & Surf Rock
          </Animated.Text>
        </View>
        <Icon
          name={true ? "heart" : "heart-outline"} // TODO: heart
          size={ICON_SIZE}
          style={styles.icon}
        />
        <View style={styles.dotsContainer}>
          <DotsView color={COLORS.white} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: "center",
    top: 16 * ratio,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.6,
    color: COLORS.white,
  },
  icon: {
    color: COLORS.green,
    right: 54,
    position: "absolute",
  },
  arrowIcon: {
    color: COLORS.white,
    position: "absolute",
    left: 15,
  },
  dotsContainer: {
    position: "absolute",
    right: 15,
  },
});

export default PlayListDetailsHeader;
