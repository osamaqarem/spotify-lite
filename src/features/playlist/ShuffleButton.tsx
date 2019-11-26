import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { COLORS, ratio } from "../../utils";

export const BUTTON_HEIGHT = 50;

const ShuffleButton = ({ offsetY }: { offsetY: Animated.Value<number> }) => {
  const translateY = offsetY.interpolate({
    inputRange: [0, 430],
    outputRange: [0, -232 * ratio],
    extrapolate: Animated.Extrapolate.CLAMP,
  });
  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: translateY }] }]}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.btnText}>SHUFFLE PLAY</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 280 * ratio,
    marginBottom: 16,
    alignItems: "center",
    height: BUTTON_HEIGHT,
    zIndex: 1,
  },
  button: {
    width: 230,
    height: BUTTON_HEIGHT,
    backgroundColor: COLORS.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "bold",
  },
});

export default ShuffleButton;
