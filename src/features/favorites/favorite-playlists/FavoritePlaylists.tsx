import React, { useEffect } from "react";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import ListOfPlaylists from "../../../components/ListOfPlaylists";
import {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  getPlayListById,
} from "../../../redux/actions";
import { RootStoreType } from "../../../redux/reducers";
import { Routes } from "../../../utils";
import { NavigationEvents } from "react-navigation";
import { StatusBar } from "react-native";

const FavoritePlaylists = ({
  profile,
  currentUserPlaylists,
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  savedTracksCount,
  navigation,
  getPlayListById,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  useEffect(() => {
    getCurrentUserPlaylists();
    getCurrentUserSavedTracks();
  }, [getCurrentUserPlaylists, getCurrentUserSavedTracks]);

  const onPlaylistPressed = (id: string) => {
    getPlayListById(id);
    navigation.navigate(
      Routes.AppTabs.FavoritesTabs.FavoritePlaylistsStack.PlaylistDetails,
    );
  };

  const PlaylistsListProps = {
    username: (profile && profile.display_name) || "Error",
    currentUserPlaylists,
    savedTracksCount,
    onPlaylistPressed,
  };

  return (
    <>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle("light-content");
        }}
      />
      <ListOfPlaylists {...PlaylistsListProps} />
    </>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  profile: state.userReducer.profile,
  currentUserPlaylists: state.playlistReducer.currentUserPlaylists,
  savedTracksCount: state.libraryReducer.currentUserSavedTracksCount,
});

const mapDispatchToProp = {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  getPlayListById,
};

const connector = connect(mapStateToProps, mapDispatchToProp);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(FavoritePlaylists);
