import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-navigation";
import { COLORS, widthRatio, isIphoneX } from "../utils";

export const BACKBTN_HEIGHT = 80 * widthRatio;

const BackBtn = ({ goBack }: { goBack: () => void }) => {
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: BACKBTN_HEIGHT,
        zIndex: 1,
        padding: 10,
        position: "absolute",
        top: 0,
      }}>
      <Icon
        onPress={goBack}
        name="arrow-left"
        size={28}
        style={[
          {
            color: COLORS.white,
            textAlignVertical: "center",
            marginTop: isIphoneX() ? 18 : 10,
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default BackBtn;
