import { Dimensions } from "react-native";

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
