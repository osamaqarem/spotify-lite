import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../utils";
import SearchIcon from "../navigation/SearchIcon";

const TopBarSearch = () => (
  <View style={styles.container}>
    <View style={styles.iconContainer}>{SearchIcon("#000")}</View>
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
        }}>
        Search artists, songs and playlists
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    height: 60,
    backgroundColor: COLORS.tabSearch,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  iconContainer: { marginRight: 15, marginTop: 5 },
});

export default TopBarSearch;
