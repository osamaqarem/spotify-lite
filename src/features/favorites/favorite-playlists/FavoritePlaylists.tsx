import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationEvents } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import ListOfPlaylists from "../../../components/ListOfPlaylists";
import {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  getPlayListById,
  setPlaylistDetails,
} from "../../../redux/actions";
import { RootStoreType } from "../../../redux/types";
import { Routes } from "../../../utils";
import { PlaylistDetailsType } from "../../../redux/reducers/playlistReducer";

const FavoritePlaylists = ({
  profile,
  currentUserPlaylists,
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  currentUserSavedTracks,
  savedTracksCount,
  navigation,
  getPlayListById,
  setPlaylistDetails,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  useEffect(() => {
    getCurrentUserPlaylists();
    getCurrentUserSavedTracks();
  }, [getCurrentUserPlaylists, getCurrentUserSavedTracks]);

  const onPlaylistPressed = (id: string) => {
    getPlayListById(id);
    navigation.navigate(Routes.AppTabs.FavoritesStack.PlaylistDetails);
  };

  const onFavSongsPressed = () => {
    currentUserSavedTracks && setPlaylistDetails(currentUserSavedTracks);
    navigation.navigate(Routes.AppTabs.FavoritesStack.PlaylistDetails);
  };
  return (
    <>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle("light-content");
        }}
      />

      <ListOfPlaylists
        username={(profile && profile.display_name) || "Error"}
        currentUserPlaylists={currentUserPlaylists}
        savedTracksCount={savedTracksCount}
        onPlaylistPressed={onPlaylistPressed}
        onFavSongsPressed={onFavSongsPressed}
      />
    </>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  profile: state.userReducer.profile,
  currentUserPlaylists: state.playlistReducer.currentUserPlaylists,
  savedTracksCount: state.libraryReducer.currentUserSavedTracksCount,
  currentUserSavedTracks: state.libraryReducer.currentUserSavedTracks,
});

const mapDispatchToProp = {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  getPlayListById,
  setPlaylistDetails,
};

const connector = connect(mapStateToProps, mapDispatchToProp);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(FavoritePlaylists);
