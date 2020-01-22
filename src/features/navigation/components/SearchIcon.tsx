import React from "react";
import Octicon from "react-native-vector-icons/Octicons";
import { TextStyle } from "react-native";

const SearchIcon = ({
  tintColor,
  textStyle,
}: {
  tintColor: string;
  textStyle?: TextStyle;
}) => {
  return (
    <Octicon
      style={[{ bottom: 2.5 }, textStyle]}
      name="search"
      size={22}
      color={tintColor}
    />
  );
};

export default SearchIcon;
