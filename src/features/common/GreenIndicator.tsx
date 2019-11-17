import React from "react";
import { ActivityIndicator, View } from "react-native";

const GreenIndicator = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        top: 0,
        left: 0,
        backgroundColor: "#000",
      }}>
      <ActivityIndicator size={60} color="darkgreen" />
    </View>
  );
};

export default GreenIndicator;
