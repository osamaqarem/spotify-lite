import { Easing } from "react-native-reanimated";
import { Dimensions, Platform } from "react-native";

export const { height, width } = Dimensions.get("window");

export const MAGIC_NUM = 1000;
export const ratio = (width / 414 / height) * MAGIC_NUM;

export const COLORS = {
  tabBar: "#222326",
  itemInactive: "#ADAEB3",
  background: "#121212",
  white: "#FFFFFF",
  darkWhite: "#FDFDFD",
  green: "#1DB954",
  grey: "#B9B9B9",
  darkGrey: "#5A5A5A",
};

export const btnScaleAnim = {
  in: { toValue: 0.98, duration: 50, easing: Easing.inOut(Easing.ease) },
  out: {
    toValue: 1,
    duration: 50,
    easing: Easing.inOut(Easing.ease),
  },
};

// Forked from: https://github.com/ptelad/react-native-iphone-x-helper/blob/master/index.js
export function isIphoneX() {
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || height === 896 || width === 896)
  );
}
