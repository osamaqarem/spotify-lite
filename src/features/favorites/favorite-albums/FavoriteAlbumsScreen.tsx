import React, { useEffect } from "react";
import { connect } from "react-redux";
import ListOfAlbums from "../../../components/ListOfAlbums";
import { getCurrentUserSavedAlbums } from "../../../redux/actions";
import { SavedAlbumType } from "../../../redux/reducers/libraryReducer";
import { RootStoreType } from "../../../redux/store";

const FavoriteAlbumsScreen = ({
  getCurrentUserSavedAlbums,
  currentUserAlbums,
}: {
  getCurrentUserSavedAlbums: () => void;
  currentUserAlbums: SavedAlbumType[];
}) => {
  useEffect(() => {
    getCurrentUserSavedAlbums();
  }, [getCurrentUserSavedAlbums]);

  return <ListOfAlbums currentUserAlbums={currentUserAlbums} />;
};

const mapStateToProps = (state: RootStoreType) => ({
  currentUserAlbums: state.libraryReducer.currentUserSavedAlbums,
});

export default connect(mapStateToProps, {
  getCurrentUserSavedAlbums,
})(FavoriteAlbumsScreen);
