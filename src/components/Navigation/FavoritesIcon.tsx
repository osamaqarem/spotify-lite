import React from "react";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../utils";

const FavoritesIcon = (color: string) => {
  if (color === COLORS.itemInactive) {
    return (
      <MaterialCommunityIcon
        style={{ bottom: 6 }}
        name="heart-outline"
        size={22}
        color={color}
      />
    );
  } else {
    return (
      <MaterialCommunityIcon
        style={{ bottom: 6 }}
        name="heart"
        size={22}
        color={color}
      />
    );
  }
};

export default FavoritesIcon;
