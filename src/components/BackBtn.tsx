import React from "react";
import { TextStyle, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-navigation";
import { COLORS, widthRatio } from "../utils/constants";

export const BACKBTN_HEIGHT = 80 * widthRatio;

const BackBtn = ({
  goBack,
  viewStyle,
  textStyle,
}: {
  goBack: () => void;
  viewStyle?: ViewStyle;
  textStyle?: TextStyle;
}) => {
  return (
    <SafeAreaView
      style={[
        {
          height: BACKBTN_HEIGHT,
          zIndex: 1,
          position: "absolute",
          top: 0,
          left: 10,
        },
        viewStyle,
      ]}>
      <Icon
        onPress={goBack}
        name="arrow-left"
        size={28}
        style={[
          {
            color: COLORS.white,
            textAlignVertical: "center",
            padding: 10,
            marginTop: 10,
          },
          textStyle,
        ]}
      />
    </SafeAreaView>
  );
};

export default BackBtn;
