import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../utils";
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon name="arrow-left" size={ICON_SIZE} style={styles.arrowIcon} />
        <View
          style={{
            width: "54%",
            alignItems: "center",
          }}>
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                opacity: opacityAnim,
              },
            ]}>
            Psyche Pop & Surf Rock
          </Animated.Text>
        </View>
        <Icon
          name={true ? "heart" : "heart-outline"} // TODO: heart
          size={ICON_SIZE}
          style={styles.icon}
        />
        <View style={styles.dotsContainer}>
          <DotsView />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    height: HEADER_HEIGHT,
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    marginTop: 8,
    alignItems: "center",
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
