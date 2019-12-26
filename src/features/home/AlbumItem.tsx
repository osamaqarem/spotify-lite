import React from "react";
import { Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { AlbumType } from "../../data/models";
import { albumDimensions, styles } from "./styles";

const AlbumItem = ({
  album,
  onPress,
}: {
  album: AlbumType;
  onPress: (id: string) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(album.id)}
      key={album.id}
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
