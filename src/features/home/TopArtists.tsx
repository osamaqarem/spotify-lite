import React from "react";
import { AlbumType } from "../../redux/reducers/albumReducer";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { styles, albumDimensions } from "./styles";
import AlbumItem from "./AlbumItem";
import { NavigationTabProp } from "react-navigation-tabs";

const TopArtists = ({
  userTopArtistsHeader,
  userTopArtists,
  navigation,
}: {
  userTopArtistsHeader: AlbumType;
  userTopArtists: AlbumType[];
  navigation: NavigationTabProp;
}) => (
  <>
    <Text style={[styles.centeredText, styles.headerText, { marginTop: 30 }]}>
      Your top artists
    </Text>
    <View
      style={[
        {
          width: albumDimensions.ALBUM_DIMEN_MADE + 70,
          alignSelf: "center",
        },
      ]}>
      <FastImage
        source={{
          uri: (userTopArtistsHeader && userTopArtistsHeader.url) || "",
        }}
        style={{
          height: albumDimensions.ALBUM_DIMEN_MADE + 70,
          width: albumDimensions.ALBUM_DIMEN_MADE + 70,
          marginTop: 20,
        }}
      />
      <Text
        numberOfLines={2}
        style={[
          styles.centeredText,
          styles.albumText,
          { marginBottom: 25, fontSize: 15 },
        ]}>
        {userTopArtistsHeader && userTopArtistsHeader.name}
      </Text>
    </View>
    <View style={styles.content}>
      {userTopArtists &&
        userTopArtists.map((album: any, index: number) =>
          AlbumItem(album, index, navigation),
        )}
    </View>
  </>
);

export default TopArtists;
