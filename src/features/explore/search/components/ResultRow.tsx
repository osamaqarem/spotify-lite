import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { AlbumType } from "../../../../data/models/spotify";
import UIHelper from "../../../../utils/helpers/UIHelper";
import { COLORS } from "../../../../utils/constants";

export const MARGIN_HORIZONTAL = 14;

const ResultRow = React.memo(({ result }: { result: AlbumType }) => {
  const scale = new Animated.Value(1);
  const clock = new Animated.Clock();
  const opacityAnim = UIHelper.opacityTiming(clock, 0, 1, 500);

  return (
    <TouchableOpacity
      onPressIn={() => Animated.timing(scale, UIHelper.btnScaleAnim.in).start()}
      onPressOut={() =>
        Animated.timing(scale, UIHelper.btnScaleAnim.out).start()
      }
      onPress={() => {
        return;
      }}>
      <Animated.View
        style={{
          opacity: opacityAnim,
          transform: [{ scale }],
          marginHorizontal: MARGIN_HORIZONTAL,
          alignItems: "center",
          flexDirection: "row",
          marginTop: 10,
          marginBottom: 3,
        }}>
        <FastImage
          source={{
            uri: result.imageURL || "",
          }}
          style={{
            height: 54,
            width: 54,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            marginHorizontal: 12,
            maxWidth: "80%",
            marginTop: 2,
          }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: COLORS.darkWhite,
              letterSpacing: 0.8,
              fontSize: 16,
            }}>
            {result.name}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontWeight: "normal",
              color: COLORS.grey,
              letterSpacing: 0.8,
              fontSize: 14,
            }}>
            {result.type}
            {result.type === "Song" ? " • " + result.artist : null}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

ResultRow.displayName = "ResultRow";

export default ResultRow;
