import React, { useContext } from "react";
import { ScrollView, Text, View } from "react-native";
import { NavigationContext } from "react-navigation";
import { connect, ConnectedProps } from "react-redux";
import { getAlbumById } from "../../redux/actions";
import { RootStoreType } from "../../redux/store";
import { Routes } from "../../utils";
import AlbumRecentItem from "./AlbumRecentItem";
import { albumDimensions, styles } from "./styles";

const RecentlyPlayed = ({ getAlbumById, recentlyPlayedAlbums }: ReduxProps) => {
  const navigation = useContext(NavigationContext);

  const onAlbumPressed = (id: string) => {
    getAlbumById(id);
    requestAnimationFrame(() => {
      navigation.navigate(Routes.DetailsStack.PlaylistDetailsScreen);
    });
  };

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
            recentlyPlayedAlbums.map((album, index: number) => (
              <AlbumRecentItem
                key={index}
                album={album}
                onPress={onAlbumPressed}
              />
            ))}
        </View>
      </ScrollView>
    </>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  recentlyPlayedAlbums: state.albumReducer.recentlyPlayedAlbums,
});

const mapDispatchToProps = {
  getAlbumById,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(RecentlyPlayed);
