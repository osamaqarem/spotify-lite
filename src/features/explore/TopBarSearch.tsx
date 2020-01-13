import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { COLORS } from "../../utils";
import SearchIcon from "../navigation/icons/SearchIcon";

const TopBarSearch = ({ onSearchPressed }: { onSearchPressed: () => void }) => (
  <TouchableWithoutFeedback onPress={onSearchPressed}>
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <SearchIcon tintColor="#000" />
      </View>
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
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    height: 58,
    backgroundColor: COLORS.white,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  iconContainer: { marginRight: 15, marginTop: 5 },
});

export default TopBarSearch;
