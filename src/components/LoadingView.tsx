import React from "react";
import { ActivityIndicator, ViewStyle } from "react-native";
import { COLORS } from "../utils/constants";

export const LoadingView = ({ viewStyle }: { viewStyle?: ViewStyle }) => (
  <ActivityIndicator
    animating
    size={50}
    color={COLORS.green}
    style={[
      { flex: 1, justifyContent: "center", alignItems: "center" },
      viewStyle,
    ]}
  />
);
export default LoadingView;
