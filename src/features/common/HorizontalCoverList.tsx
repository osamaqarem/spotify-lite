import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { albumDimensions, styles } from "../home/styles";
import { AlbumType } from "../../data/models";

const HorizontalCoverList = ({
  album: item,
  onPress,
  coverShape,
}: {
  album: AlbumType;
  onPress: (id: string) => void;
  coverShape: "CIRCLE" | "SQUARE";
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item.id)}
      style={{ marginHorizontal: 8, flexDirection: "column" }}>
      <FastImage
        source={{
          uri: (item && item.url) || "",
        }}
        style={{
          height: albumDimensions.ALBUM_DIMEN_RECENT,
          width: albumDimensions.ALBUM_DIMEN_RECENT,
          borderRadius: coverShape === "CIRCLE" ? 80 : 0,
        }}
      />
      <View
        style={{
          width: 140,
          marginTop: 5,
          alignSelf: "center",
        }}>
        <Text
          numberOfLines={2}
          style={[
            styles.centeredText,
            {
              fontSize: 13,
              textAlign: "center",
            },
          ]}>
          {item && item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default HorizontalCoverList;
