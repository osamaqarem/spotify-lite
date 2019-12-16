import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../utils";
import DotsView from "./DotsView";

const Track = ({ title, artist }: { title: string; artist: string }) => (
  <View style={styles.container}>
    <View style={styles.trackContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.artist}>{artist}</Text>
    </View>
    <DotsView containerStyle={{ marginRight: 10 }} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12.5,
  },
  trackContainer: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    letterSpacing: 0.6,
  },
  artist: { color: COLORS.grey, fontSize: 12.5, letterSpacing: 0.6 },
});

export default Track;
