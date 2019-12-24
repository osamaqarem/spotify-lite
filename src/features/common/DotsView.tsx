import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { COLORS } from "../../utils";
import { Color } from "csstype";

const DotsView = ({
  color,
  containerStyle,
}: {
  color?: Color;
  containerStyle?: ViewStyle;
}) => {
  const bgColor = color ? color : COLORS.grey;

  return (
    <View style={[{ flexDirection: "column" }, containerStyle]}>
      <View
        style={[
          styles.dot,
          {
            marginBottom: 5.5,
            backgroundColor: bgColor,
          },
        ]}
      />
      <View
        style={[
          styles.dot,
          {
            marginBottom: 5.5,
            backgroundColor: bgColor,
          },
        ]}
      />
      <View
        style={[
          styles.dot,
          {
            backgroundColor: bgColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    height: 2.5,
    width: 2.5,
    borderRadius: 2,
  },
});

export default DotsView;
