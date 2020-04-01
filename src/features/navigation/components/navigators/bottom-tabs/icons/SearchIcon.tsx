import React from "react";
import { TextStyle } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

const SearchIcon = ({
  tintColor,
  textStyle,
  onPress,
}: {
  tintColor: string;
  textStyle?: TextStyle;
  onPress?: () => void;
}) => {
  return (
    <MaterialIcon
      onPress={onPress}
      style={[{ bottom: 6 }, textStyle]}
      name="magnify"
      size={26}
      color={tintColor}
    />
  );
};

export default SearchIcon;
