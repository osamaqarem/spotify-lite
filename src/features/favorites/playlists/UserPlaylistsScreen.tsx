import React, { useEffect } from "react";
import { connect } from "react-redux";
import PlaylistsList from "../../common/PlaylistsList";
import {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
} from "../../../redux/actions";
import { UserProfileResponse } from "../../../data/models";
import { SavedPlaylistsType } from "../../../redux/reducers/libraryReducer";
import { RootStoreType } from "../../../redux/store";

type UserPlaylistsScreenType = {
  profile: UserProfileResponse | null;
  getCurrentUserPlaylists: () => void;
  getCurrentUserSavedTracks: () => void;
  currentUserPlaylists: SavedPlaylistsType[];
  savedTracksCount: number | null;
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

const mapStateToProps = (state: RootStoreType) => ({
  profile: state.userReducer.profile,
  currentUserPlaylists: state.libraryReducer.currentUserPlaylists,
  savedTracksCount: state.libraryReducer.currentUserSavedTracksCount,
});

export default connect(mapStateToProps, {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
})(UserPlaylistsScreen);
