import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AlbumType } from "../../../redux/reducers/albumReducer";
import ArtistsList from "../../common/ArtistsList";
import { ReduxStoreType } from "../../../redux/reducers";
import { getCurrentUserSavedArtists } from "../../../redux/actions";

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
