import React, { useContext } from "react";
import { Text, View } from "react-native";
import { NavigationContext } from "react-navigation";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../redux/store";
import { Routes } from "../../utils";
import AlbumItem from "./AlbumItem";
import { styles } from "./styles";
import { getPlayListById } from "../../redux/actions/playlistActions";
import { AlbumType } from "../../data/models";

const FeaturedPlaylists = ({
  featuredPlaylists,
  getPlayListById,
}: ReduxProps) => {
  const navigation = useContext(NavigationContext);

  const onPlaylistPressed = (id: string) => {
    getPlayListById(id);
    navigation.navigate(Routes.DetailsRoutes.PlaylistDetails);
  };

  return (
    <>
      <Text style={[styles.centeredText, styles.headerText, { marginTop: 50 }]}>
        Featured playlists
      </Text>
      <View style={styles.content}>
        {featuredPlaylists &&
          featuredPlaylists.map((album: AlbumType, index: number) => (
            <AlbumItem
              key={album.id}
              {...{
                album,
                index,
                onPress: onPlaylistPressed,
              }}
            />
          ))}
      </View>
    </>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  featuredPlaylists: state.browseReducer.featuredPlaylists,
});

const mapDispatchToProps = {
  getPlayListById,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(FeaturedPlaylists);
