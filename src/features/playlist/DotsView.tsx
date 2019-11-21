import React from "react";
import { View } from "react-native";
import { COLORS } from "../../utils";

const DotsView = () => (
  <View style={{ flexDirection: "column", marginRight: 10 }}>
    <View
      style={{
        height: 2.5,
        width: 2.5,
        borderRadius: 2,
        backgroundColor: COLORS.grey,
        marginBottom: 5.5,
      }}
    />
    <View
      style={{
        height: 2.5,
        width: 2.5,
        borderRadius: 2,
        backgroundColor: COLORS.grey,
        marginBottom: 5.5,
      }}
    />
    <View
      style={{
        height: 2.5,
        width: 2.5,
        borderRadius: 2,
        backgroundColor: COLORS.grey,
      }}
    />
  </View>
);

export default DotsView;
