import React, { useEffect } from "react";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import ListOfAlbums from "../../../components/ListOfAlbums";
import {
  getCurrentUserSavedAlbums,
  getAlbumById,
} from "../../../redux/actions";
import { RootStoreType } from "../../../redux/types";
import { Routes } from "../../../utils";

const FavoriteAlbums = ({
  getCurrentUserSavedAlbums,
  currentUserAlbums,
  getAlbumById,
  navigation,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  useEffect(() => {
    getCurrentUserSavedAlbums();
  }, [getCurrentUserSavedAlbums]);

  const onPlaylistPressed = (id: string) => {
    getAlbumById(id);
    navigation.navigate(Routes.AppTabs.FavoritesStack.PlaylistDetails);
  };

  return (
    <ListOfAlbums
      currentUserAlbums={currentUserAlbums}
      onPlaylistPressed={onPlaylistPressed}
    />
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  currentUserAlbums: state.libraryReducer.currentUserSavedAlbums,
});

const mapDispatchToProps = {
  getCurrentUserSavedAlbums,
  getAlbumById,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(FavoriteAlbums);
