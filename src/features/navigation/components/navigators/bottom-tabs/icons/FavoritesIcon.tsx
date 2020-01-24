import React from "react";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../../../../../utils";

const FavoritesIcon = ({ tintColor }: { tintColor: string }) => {
  if (tintColor === COLORS.itemInactive) {
    return (
      <MaterialCommunityIcon
        style={{ bottom: 6 }}
        name="heart-outline"
        size={22}
        color={tintColor}
      />
    );
  } else {
    return (
      <MaterialCommunityIcon
        style={{ bottom: 6 }}
        name="heart"
        size={22}
        color={tintColor}
      />
    );
  }
};

export default FavoritesIcon;
