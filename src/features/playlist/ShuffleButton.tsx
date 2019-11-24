import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../utils";
import Animated from "react-native-reanimated";

export const BUTTON_HEIGHT = 50;

const ShuffleButton = ({ offsetY }: { offsetY: Animated.Value<number> }) => {
  const translateY = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -270],
    extrapolate: Animated.Extrapolate.CLAMP,
  });
  return (
    <Animated.View
      style={{
        marginTop: "85%",
        marginBottom: 16,
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        transform: [{ translateY: translateY }],
        height: BUTTON_HEIGHT,
        zIndex: 1,
      }}>
      <TouchableOpacity
        style={{
          width: 230,
          height: BUTTON_HEIGHT,
          backgroundColor: COLORS.green,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 32,
        }}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 14,
            letterSpacing: 2,
            fontWeight: "bold",
          }}>
          SHUFFLE PLAY
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ShuffleButton;
