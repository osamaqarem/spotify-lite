import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, isIphoneX } from "../utils";

const BackBtn = ({ goBack }: { goBack: () => void }) => {
  return (
    <Icon
      onPress={() => {
        goBack();
      }}
      name="arrow-left"
      size={28}
      style={[
        {
          color: COLORS.white,
          left: 10,
          justifyContent: "center",
          textAlignVertical: "center",
          zIndex: 1,
          padding: 10,
          position: "absolute",
          top: isIphoneX() ? 50 : 10,
        },
      ]}
    />
  );
};

export default BackBtn;
