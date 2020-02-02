import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { COLORS } from "../utils/constants";

const DownloadHeader = () => (
  <View style={styles.container}>
    <Text style={styles.download}>Download</Text>
    <Switch
      value={false}
      style={{ marginRight: 10 }}
      onValueChange={() => {
        return;
      }}
      thumbColor={COLORS.grey}
      trackColor={{ false: COLORS.darkerGrey, true: "green" }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
  },
  download: {
    flex: 1,
    color: COLORS.darkWhite,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

export default DownloadHeader;
