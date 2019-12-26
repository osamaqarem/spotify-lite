import React, { useEffect } from "react";
import { connect } from "react-redux";
import ListOfArtists from "../../../components/ListOfArtists";
import { getCurrentUserSavedArtists } from "../../../redux/actions";
import { RootStoreType } from "../../../redux/store";
import { AlbumType } from "../../../data/models";

const FavoriteArtistsScreen = ({
  getCurrentUserSavedArtists,
  currentUserArtists,
}: {
  getCurrentUserSavedArtists: () => void;
  currentUserArtists: AlbumType[];
}) => {
  useEffect(() => {
    getCurrentUserSavedArtists();
  }, [getCurrentUserSavedArtists]);

  return <ListOfArtists currentUserArtists={currentUserArtists} />;
};

const mapStateToProps = (state: RootStoreType) => ({
  currentUserArtists: state.followRedcuer.currentUserSavedArtists,
});

export default connect(mapStateToProps, { getCurrentUserSavedArtists })(
  FavoriteArtistsScreen,
);
