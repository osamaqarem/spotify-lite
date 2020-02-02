import Animated, { Easing } from "react-native-reanimated";
import {
  Platform,
  Animated as AnimatedRN,
  Easing as EasingRN,
} from "react-native";
import { height, width } from "../constants/_theme";

const btnScaleAnim = {
  in: { toValue: 0.98, duration: 50, easing: Easing.inOut(Easing.ease) },
  out: {
    toValue: 1,
    duration: 50,
    easing: Easing.inOut(Easing.ease),
  },
};

// Forked from: react-native-iphone-x-helper
// https://github.com/ptelad/react-native-iphone-x-helper
// TODO: better approach?
const isIphoneX = () => {
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || height === 896 || width === 896)
  );
};

const onScroll = (contentOffset: {
  x?: Animated.Node<number>;
  y?: Animated.Node<number>;
}) =>
  Animated.event([
    {
      nativeEvent: {
        contentOffset,
      },
    },
  ]);

// Forked from react-navigation-transitions
// https://github.com/plmok61/react-navigation-transitions
const fadeIn = (duration = 300) => {
  return {
    transitionSpec: {
      duration,
      easing: EasingRN.out(EasingRN.poly(4)),
      timing: AnimatedRN.timing,
      useNativeDriver: true,
    },
    screenInterpolator: ({ position, scene }: any) => {
      const { index } = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1],
      });

      return { opacity };
    },
  };
};

const UIHelper = {
  btnScaleAnim,
  isIphoneX,
  onScroll,
  fadeIn,
};

export default UIHelper;
