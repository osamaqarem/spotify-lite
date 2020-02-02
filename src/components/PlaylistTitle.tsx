import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, ratio } from "../utils/constants";
import { SafeAreaView } from "react-navigation";

export const HEADER_HEIGHT = 90 * ratio;

const PlaylistTitle = ({ name }: { name: string | undefined }) => {
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.content}>
        <View
          style={{
            width: "54%",
          }}>
          <Text numberOfLines={1} style={[styles.title]}>
            {name}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -5,
  },
  content: {
    alignItems: "center",
    top: 16 * ratio,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.6,
    color: COLORS.white,
    textAlign: "center",
    zIndex: -5,
  },
});

export default PlaylistTitle;
