import React from "react";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../utils/constants";

const GreenIndicator = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        top: 0,
        left: 0,
        backgroundColor: COLORS.background,
      }}>
      <ActivityIndicator size={60} color="darkgreen" />
    </View>
  );
};

export default GreenIndicator;
