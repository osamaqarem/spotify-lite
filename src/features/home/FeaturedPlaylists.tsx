import React from "react";
import { Text, View } from "react-native";
import { AlbumType } from "../../redux/reducers/albumReducer";
import AlbumItem from "./AlbumItem";
import { styles } from "./styles";
import { NavigationTabProp } from "react-navigation-tabs";

const FeaturedPlaylists = ({
  featuredPlaylists,
  navigation,
}: {
  featuredPlaylists: AlbumType[];
  navigation: NavigationTabProp;
}) => (
  <>
    <Text style={[styles.centeredText, styles.headerText, { marginTop: 50 }]}>
      Featured playlists
    </Text>
    <View style={styles.content}>
      {featuredPlaylists &&
        featuredPlaylists.map((album, index: number) =>
          AlbumItem(album, index, navigation),
        )}
    </View>
  </>
);

export default FeaturedPlaylists;
