import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AlbumType } from "../../../redux/reducers/albumReducer";
import ArtistsList from "../../common/ArtistsList";
import { getCurrentUserSavedArtists } from "../../../redux/actions";
import { RootStoreType } from "../../../redux/store";

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

const mapStateToProps = (state: RootStoreType) => ({
  currentUserArtists: state.followRedcuer.currentUserSavedArtists,
});

export default connect(mapStateToProps, { getCurrentUserSavedArtists })(
  UserArtistsScreen,
);
