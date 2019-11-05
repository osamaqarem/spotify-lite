import React, { useEffect } from "react";
import { connect } from "react-redux";
import PlaylistsList from "../../components/Favorites/PlaylistsList";
import { ProfileResponse } from "../../data/types";
import { getCurrentUserPlaylists } from "../../redux/actions";

type FavPlaylistScreenType = {
  profile: ProfileResponse;
  getCurrentUserPlaylists: () => void;
  currentUserPlaylists: { name: string; url: string; owner: string };
};

const FavPlaylistScreen = ({
  profile,
  currentUserPlaylists,
  getCurrentUserPlaylists,
}: FavPlaylistScreenType) => {
  useEffect(() => {
    getCurrentUserPlaylists();
  }, [getCurrentUserPlaylists]);

  const PlaylistsListProps = {
    username: (profile && profile.display_name) || "Error",
    data: currentUserPlaylists,
  };

  return <PlaylistsList {...PlaylistsListProps} />;
};

const mapStateToProps = (state: any) => ({
  profile: state.authReducer.profile,
  currentUserPlaylists: state.libraryReducer.currentUserPlaylists,
});

export default connect(
  mapStateToProps,
  { getCurrentUserPlaylists },
)(FavPlaylistScreen);
