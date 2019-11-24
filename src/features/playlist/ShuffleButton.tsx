import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../utils";

const ShuffleButton = () => {
  return (
    <View style={{ alignSelf: "center", marginTop: 14, marginBottom: 16 }}>
      <TouchableOpacity
        style={{
          width: 230,
          height: 50,
          backgroundColor: COLORS.green,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 32,
        }}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 14,
            letterSpacing: 2,
            fontWeight: "bold",
          }}>
          SHUFFLE PLAY
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShuffleButton;
