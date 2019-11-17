import React from "react";
import { Text } from "react-native";
import FastImage from "react-native-fast-image";
import { styles, albumDimensions } from "./styles";
import { NavigationTabProp } from "react-navigation-tabs";
import { TouchableOpacity } from "react-native-gesture-handler";

const AlbumItem = (
  album: {
    name: string | null;
    url: string | null;
  },
  index: number,
  navigation: NavigationTabProp,
) => {
  return (
    <TouchableOpacity
      onPress={() => {
        // TODO:
      }}
      key={index}
      style={[{ width: albumDimensions.ALBUM_DIMEN_MADE }]}>
      <FastImage
        source={{
          uri: (album && album.url) || "",
        }}
        style={{
          height: albumDimensions.ALBUM_DIMEN_MADE,
          width: albumDimensions.ALBUM_DIMEN_MADE,
          marginTop: 20,
        }}
      />
      <Text numberOfLines={2} style={[styles.centeredText, styles.albumText]}>
        {album && album.name}
      </Text>
    </TouchableOpacity>
  );
};

export default AlbumItem;
