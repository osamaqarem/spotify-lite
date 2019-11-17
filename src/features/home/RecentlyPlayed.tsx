import React from "react";
import { View, Text } from "react-native";
import { AlbumType } from "../../redux/reducers/albumReducer";
import { styles, albumDimensions } from "./styles";
import { ScrollView } from "react-native-gesture-handler";
import AlbumRecentItem from "./AlbumRecentItem";
import { NavigationTabProp } from "react-navigation-tabs";

const RecentlyPlayed = ({
  recentlyPlayedAlbums,
  navigation,
}: {
  recentlyPlayedAlbums: AlbumType[];
  navigation: NavigationTabProp;
}) => {
  return (
    <>
      <Text
        style={[
          styles.centeredText,
          styles.headerText,
          { fontSize: 18.5, marginTop: 20, marginBottom: 10 },
        ]}>
        Recently played
      </Text>
      <ScrollView
        overScrollMode="never"
        style={{ height: albumDimensions.ROW_SCROLLVIEW_HEIGHT }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <View style={styles.rowScrollContainer}>
          {recentlyPlayedAlbums &&
            recentlyPlayedAlbums.map((album, index: number) =>
              AlbumRecentItem(album, index, navigation),
            )}
        </View>
      </ScrollView>
    </>
  );
};

export default RecentlyPlayed;
