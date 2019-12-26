import React, { useEffect } from "react";
import { connect } from "react-redux";
import ListOfPlaylists from "../../../components/ListOfPlaylists";
import {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
} from "../../../redux/actions";
import { UserProfileResponse } from "../../../data/models";
import { RootStoreType } from "../../../redux/store";
import { SavedPlaylistsType } from "../../../redux/reducers/playlistReducer";

type UserPlaylistsScreenType = {
  profile: UserProfileResponse | null;
  getCurrentUserPlaylists: () => void;
  getCurrentUserSavedTracks: () => void;
  currentUserPlaylists: SavedPlaylistsType[];
  savedTracksCount: number | null;
};

const FavoritePlaylistsScreen = ({
  profile,
  currentUserPlaylists,
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  savedTracksCount,
}: UserPlaylistsScreenType) => {
  useEffect(() => {
    getCurrentUserPlaylists();
    getCurrentUserSavedTracks();
  }, [getCurrentUserPlaylists, getCurrentUserSavedTracks]);

  const PlaylistsListProps = {
    username: (profile && profile.display_name) || "Error",
    currentUserPlaylists,
    savedTracksCount,
  };

  return <ListOfPlaylists {...PlaylistsListProps} />;
};

const mapStateToProps = (state: RootStoreType) => ({
  profile: state.userReducer.profile,
  currentUserPlaylists: state.playlistReducer.currentUserPlaylists,
  savedTracksCount: state.libraryReducer.currentUserSavedTracksCount,
});

export default connect(mapStateToProps, {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
})(FavoritePlaylistsScreen);