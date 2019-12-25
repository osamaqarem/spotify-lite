import Animated from "react-native-reanimated";
import { HEADER_HEIGHT } from "../components/DetailsHeader";

const usePlaylistAnim = (offsetY: Animated.Value<number>) => {
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

  const translateAnim = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, HEADER_HEIGHT],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  return { opacityAnim, heightAnim, translateAnim };
};

export default usePlaylistAnim;
