import React from "react";
import { StyleProp, TextStyle } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";

const CrossIcon = ({
  handlePress,
  color,
  iconStyle,
  size,
}: {
  handlePress: () => void;
  color: string;
  size: number;
  iconStyle: StyleProp<TextStyle>;
}) => {
  return (
    <MaterialIcon
      onPress={handlePress}
      style={iconStyle}
      name="close"
      size={size}
      color={color}
    />
  );
};

export default CrossIcon;
