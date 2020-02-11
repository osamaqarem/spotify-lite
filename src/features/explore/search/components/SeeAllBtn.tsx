import React from "react";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AlbumType } from "../../../../data/models/spotify";
import { COLORS } from "../../../../utils/constants";
import { MARGIN_HORIZONTAL } from "./ResultRow";
import Animated from "react-native-reanimated";
import UIHelper from "../../../../utils/helpers/UIHelper";

const SeeAllBtn = React.memo(({ type }: { type: AlbumType["type"] }) => {
  const scale = new Animated.Value(1);

  return (
    <TouchableOpacity
      onPressIn={() => Animated.timing(scale, UIHelper.btnScaleAnim.in).start()}
      onPressOut={() =>
        Animated.timing(scale, UIHelper.btnScaleAnim.out).start()
      }
      onPress={() => {
        return;
      }}
      style={{
        marginVertical: 14,
      }}>
      <Animated.View
        style={{
          marginHorizontal: MARGIN_HORIZONTAL,
          transform: [{ scale }],
        }}>
        <Text
          style={{
            color: COLORS.darkWhite,
            letterSpacing: 0.8,
            fontSize: 16,
          }}>
          See all {type?.toLowerCase()}s
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

SeeAllBtn.displayName = "SeeAllBtn";

export default SeeAllBtn;
