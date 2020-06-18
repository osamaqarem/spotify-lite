import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextStyle, View } from "react-native";
import { IconButton } from "react-native-paper";

const BackBtnSearch = ({
  tintColor,
  textStyle,
  onPress,
  size,
}: {
  tintColor: string;
  textStyle?: TextStyle;
  size?: number;
  onPress?: () => void;
}) => {
  return (
    <IconButton
      onPress={onPress}
      // style={[textStyle, { borderRadius: size || 26 }]}
      icon="arrow-left"
      size={size || 26}
      color={tintColor}
    />
  );
};

export default BackBtnSearch;
