import Animated, { Easing } from "react-native-reanimated";
import {
  Dimensions,
  Platform,
  Animated as AnimatedRN,
  Easing as EasingRN,
} from "react-native";

export const { height, width } = Dimensions.get("window");

export const ratio = (width / 414 / height) * 1000;

export const widthRatio = width / 500;

export const COLORS = {
  tabBar: "#222326",
  itemInactive: "#ADAEB3",
  background: "#121212",
  white: "#FFFFFF",
  darkWhite: "#FDFDFD",
  green: "#1DB954",
  lightGrey: "#CBCBCC",
  grey: "#B9B9B9",
  darkGrey: "#A8A8A9",
  darkerGrey: "#505153",
};

export const btnScaleAnim = {
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
export function isIphoneX() {
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || height === 896 || width === 896)
  );
}

export const onScroll = (contentOffset: {
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
export function fadeIn(duration = 300) {
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
}
