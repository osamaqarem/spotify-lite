import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { COLORS } from "../utils";

const TopBar = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => {
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
        {title}
      </Text>
      {children}
    </View>
  );
};

export default TopBar;
