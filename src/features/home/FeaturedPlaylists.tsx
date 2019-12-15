import React, { useContext } from "react";
import { Text, View } from "react-native";
import { NavigationContext } from "react-navigation";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../redux/store";
import { Routes } from "../../utils";
import AlbumItem from "./AlbumItem";
import { styles } from "./styles";

const FeaturedPlaylists = ({ featuredPlaylists }: ReduxProps) => {
  const navigation = useContext(NavigationContext);

  const onPlaylistPressed = () => {
    navigation.navigate(Routes.NestedStack.PlaylistDetailsScreen);
  };

  return (
    <>
      <Text style={[styles.centeredText, styles.headerText, { marginTop: 50 }]}>
        Featured playlists
      </Text>
      <View style={styles.content}>
        {featuredPlaylists &&
          featuredPlaylists.map((album, index: number) => (
            <AlbumItem
              key={index}
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

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(FeaturedPlaylists);
