import React from "react";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../../utils";

const HomeIcon = (color: string) => {
  if (color === COLORS.itemInactive) {
    return (
      <MaterialCommunityIcon
        style={{ bottom: 6 }}
        name="home-outline"
        size={24.5}
        color={color}
      />
    );
  } else {
    return (
      <MaterialCommunityIcon
        style={{ bottom: 6 }}
        name="home-variant"
        size={24.5}
        color={color}
      />
    );
  }
};

export default HomeIcon;
