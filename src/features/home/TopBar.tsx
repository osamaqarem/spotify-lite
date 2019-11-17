import React from "react";
import { Text, View } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../utils";

const TopBar = () => {
  return (
    <View
      style={{
        top: 0,
        height: 56,
        width: "100%",
        backgroundColor: COLORS.tabBar,
        justifyContent: "center",
      }}>
      <Text
        style={{
          color: "white",
          alignSelf: "center",
          fontSize: 16,
          fontWeight: "bold",
        }}>
        Home
      </Text>
      <MaterialCommunityIcon
        name="settings-outline"
        size={24}
        color={COLORS.itemInactive}
        style={{ position: "absolute", right: 10 }}
      />
    </View>
  );
};

export default TopBar;
