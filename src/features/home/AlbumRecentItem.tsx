import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { albumDimensions, styles } from "./styles";
import { AlbumType } from "../../data/models";

const AlbumRecentItem = ({
  album,
  onPress,
}: {
  album: AlbumType;
  onPress: (id: string) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(album.id)}
      style={{ marginHorizontal: 8, flexDirection: "column" }}>
      <FastImage
        source={{
          uri: (album && album.url) || "",
        }}
        style={{
          height: albumDimensions.ALBUM_DIMEN_RECENT,
          width: albumDimensions.ALBUM_DIMEN_RECENT,
        }}
      />
      <View
        style={{
          width: 140,
          top: 5,
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
          {album && album.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AlbumRecentItem;
