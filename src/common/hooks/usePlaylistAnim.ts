import Animated from "react-native-reanimated"
import { dimensions } from "../theme"
import { useRef } from "react"

const usePlaylistAnim = (offsetY: Animated.Value<number>) => {
  const opacityAnim = useRef(
    offsetY.interpolate({
      inputRange: [0, 220],
      outputRange: [1, 0.3],
      extrapolate: Animated.Extrapolate.CLAMP,
    }),
  ).current

  const heightAnim = useRef(
    offsetY.interpolate({
      inputRange: [0, 300],
      outputRange: [60, 14],
      extrapolate: Animated.Extrapolate.CLAMP,
    }),
  ).current

  const translateAnim = useRef(
    offsetY.interpolate({
      inputRange: [0, 300],
      outputRange: [0, 54 * dimensions.ratio],
      extrapolate: Animated.Extrapolate.CLAMP,
    }),
  ).current

  return { opacityAnim, heightAnim, translateAnim }
}

export default usePlaylistAnim
