import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";
import { albumDimensions, styles } from "./styles";
import { AlbumType } from "../../redux/reducers/albumReducer";
import { NavigationTabProp } from "react-navigation-material-bottom-tabs";
import { NestedStackRoutes } from "../navigation/Navigation";

const AlbumRecentItem = (
  album: AlbumType,
  index: number,
  navigation: NavigationTabProp,
) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(NestedStackRoutes.PlaylistDetailsScreen)
      }
      key={index}
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
