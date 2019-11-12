import React, { useEffect } from "react";
import { connect } from "react-redux";
import PlaylistsList from "../components/Favorites/PlaylistsList";
import {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
} from "../redux/actions";
import { UserProfileResponse } from "../data/models";

type UserPlaylistsScreenType = {
  profile: UserProfileResponse;
  getCurrentUserPlaylists: () => void;
  getCurrentUserSavedTracks: () => void;
  currentUserPlaylists: { name: string; url: string; owner: string };
  savedTracksCount: number;
};

const UserPlaylistsScreen = ({
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
    data: { currentUserPlaylists, savedTracksCount },
  };

  return <PlaylistsList {...PlaylistsListProps} />;
};

const mapStateToProps = (state: any) => ({
  profile: state.userReducer.profile,
  currentUserPlaylists: state.libraryReducer.currentUserPlaylists,
  savedTracksCount: state.libraryReducer.currentUserSavedTracksCount,
});

export default connect(mapStateToProps, {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
})(UserPlaylistsScreen);
