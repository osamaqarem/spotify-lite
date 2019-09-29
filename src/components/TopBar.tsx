import React, {ReactNode} from "react";
import {View} from "react-native";
import {COLORS} from "../utils/_vars";

const TopBar = ({children}: {children: ReactNode}) => {
  return (
    <View
      style={{
        top: 0,
        height: 56,
        width: "100%",
        backgroundColor: COLORS.tabBar,
        justifyContent: "center",
      }}>
      {children}
    </View>
  );
};

export default TopBar;
