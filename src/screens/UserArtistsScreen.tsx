import React, { useEffect } from "react";
import { connect } from "react-redux";
import ArtistsList from "../components/Favorites/ArtistsList";
import { getCurrentUserSavedArtists } from "../redux/actions/followActions";
import { ReduxStoreType } from "../redux/reducers";
import { AlbumType } from "../redux/reducers/albumReducer";

const UserArtistsScreen = ({
  getCurrentUserSavedArtists,
  currentUserArtists,
}: {
  getCurrentUserSavedArtists: () => void;
  currentUserArtists: AlbumType[];
}) => {
  useEffect(() => {
    getCurrentUserSavedArtists();
  }, [getCurrentUserSavedArtists]);

  return <ArtistsList currentUserArtists={currentUserArtists} />;
};

const mapStateToProps = (state: ReduxStoreType) => ({
  currentUserArtists: state.followRedcuer.currentUserSavedArtists,
});

export default connect(mapStateToProps, { getCurrentUserSavedArtists })(
  UserArtistsScreen,
);
