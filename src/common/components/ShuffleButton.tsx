import React, { useRef } from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import Animated from "react-native-reanimated"
import { colors, dimensions } from "../theme"
import { HEADER_HEIGHT } from "../components/PlaylistHeaderControl"
import UIHelper from "../helpers/UIHelper"

export const SHUFFLE_BUTTON_HEIGHT = 50
const TOP = 346

const OFFSET_TOP =
  (UIHelper.isIphoneX() ? HEADER_HEIGHT * 2 : HEADER_HEIGHT) *
    dimensions.ratio +
  20

const ShuffleButton = ({ offsetY }: { offsetY: Animated.Value<number> }) => {
  const translateY = useRef(
    offsetY.interpolate({
      inputRange: [0, 300],
      outputRange: [0, -350 + OFFSET_TOP],
      extrapolate: Animated.Extrapolate.CLAMP,
    }),
  ).current

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: translateY }] }]}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.btnText}>SHUFFLE PLAY</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    top: TOP,
    alignItems: "center",
    height: SHUFFLE_BUTTON_HEIGHT,
    zIndex: 1,
  },
  button: {
    width: 230,
    height: SHUFFLE_BUTTON_HEIGHT,
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  btnText: {
    color: colors.white,
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "bold",
  },
})

export default ShuffleButton
