import React from "react";
import { Text, StyleSheet } from "react-native";
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
      style={styles.btnContainer}>
      <Animated.View
        style={[
          {
            transform: [{ scale }],
          },
          styles.container,
        ]}>
        <Text style={styles.seeAll}>See all {type?.toLowerCase()}s</Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  btnContainer: {
    marginVertical: 14,
  },

  container: {
    marginHorizontal: MARGIN_HORIZONTAL,
  },
  seeAll: {
    color: COLORS.darkWhite,
    letterSpacing: 0.8,
    fontSize: 16,
  },
});

SeeAllBtn.displayName = "SeeAllBtn";

export default SeeAllBtn;
