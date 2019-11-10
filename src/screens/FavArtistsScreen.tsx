import React, { useEffect } from "react";
import { connect } from "react-redux";
import ArtistsList from "../components/Favorites/ArtistsList";
import { getCurrentUserSavedArtists } from "../redux/actions/followActions";

const FavArtistsScreen = ({
  getCurrentUserSavedArtists,
  currentUserArtists,
}: {
  getCurrentUserSavedArtists: () => void;
  currentUserArtists: { name: string; url: string };
}) => {
  useEffect(() => {
    getCurrentUserSavedArtists();
  }, [getCurrentUserSavedArtists]);

  return <ArtistsList currentUserArtists={currentUserArtists} />;
};

const mapStateToProps = (state: any) => ({
  currentUserArtists: state.followRedcuer.currentUserSavedArtists,
});

export default connect(
  mapStateToProps,
  { getCurrentUserSavedArtists },
)(FavArtistsScreen);
