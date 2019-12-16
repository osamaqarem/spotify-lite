import React from "react";
import { View, Text, ToastAndroid, Switch, StyleSheet } from "react-native";
import { COLORS } from "../../../utils";

const DownloadHeader = () => (
  <View style={styles.container}>
    <Text style={styles.download}>Download</Text>
    <Switch
      value={false}
      style={{ flex: 1 }}
      onValueChange={() =>
        ToastAndroid.showWithGravity(
          "Not implemented",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }
      thumbColor={COLORS.grey}
      trackColor={{ false: COLORS.darkGrey, true: "green" }}
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
