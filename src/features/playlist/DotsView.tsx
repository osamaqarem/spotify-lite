import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS } from "../../utils";

const DotsView = () => (
  <View style={{ flexDirection: "column", marginRight: 10 }}>
    <View
      style={[
        styles.dot,
        {
          marginBottom: 5.5,
        },
      ]}
    />
    <View
      style={[
        styles.dot,
        {
          marginBottom: 5.5,
        },
      ]}
    />
    <View style={styles.dot} />
  </View>
);

const styles = StyleSheet.create({
  dot: {
    height: 2.5,
    width: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.grey,
  },
});

export default DotsView;
