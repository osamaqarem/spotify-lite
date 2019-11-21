import React from "react";
import { View, Text, ToastAndroid, Switch } from "react-native";
import { COLORS } from "../../utils";

const DownloadHeader = () => (
  <View
    style={{
      flexDirection: "row",
      marginBottom: 10,
    }}>
    <Text
      style={{
        flex: 1,
        color: COLORS.darkWhite,
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
      }}>
      Download
    </Text>
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

export default DownloadHeader;
