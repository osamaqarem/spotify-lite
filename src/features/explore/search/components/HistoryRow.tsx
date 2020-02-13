import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { AlbumType } from "../../../../data/models/spotify";
import { COLORS } from "../../../../utils/constants";
import UIHelper from "../../../../utils/helpers/UIHelper";
import CancelBtn from "./CancelBtn";
import { MARGIN_HORIZONTAL } from "./ResultRow";

const HistoryRow = ({
  item,
  handleRemove,
}: {
  item: AlbumType;
  handleRemove: (item: AlbumType) => void;
}) => {
  const scale = new Animated.Value(1);

  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
      }}>
      <TouchableOpacity
        style={{
          width: "86%",
          alignSelf: "flex-start",
        }}
        onPressIn={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.in).start()
        }
        onPressOut={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.out).start()
        }
        onPress={() => {
          return;
        }}>
        <Animated.View
          style={{
            transform: [{ scale }],
            marginHorizontal: MARGIN_HORIZONTAL,
            alignItems: "center",
            flexDirection: "row",
            marginTop: 10,
            marginBottom: 3,
            width: "100%",
          }}>
          <FastImage
            source={{
              uri: item.imageURL || "",
            }}
            style={{
              height: 54,
              width: 54,
              borderRadius: item.type === "Artist" ? 27 : 0,
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
              {item.name}
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
              {item.type}
              {item.type === "Song" ? " • " + item.artist : null}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
      <CancelBtn
        size={30}
        color={COLORS.darkerGrey}
        handlePress={() => {
          handleRemove(item);
        }}
        iconStyle={{
          padding: 11.5,
          textAlignVertical: "center",
          top: 4,
          left: 2,
        }}
      />
    </View>
  );
};

export default HistoryRow;
