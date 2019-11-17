import React, { useEffect } from "react";
import { connect } from "react-redux";
import AlbumsList from "../../common/AlbumsList";
import { getCurrentUserSavedAlbums } from "../../../redux/actions";
import { ReduxStoreType } from "../../../redux/reducers";
import { SavedAlbumType } from "../../../redux/reducers/libraryReducer";

const UserAlbumsScreen = ({
  getCurrentUserSavedAlbums,
  currentUserAlbums,
}: {
  getCurrentUserSavedAlbums: () => void;
  currentUserAlbums: SavedAlbumType[];
}) => {
  useEffect(() => {
    getCurrentUserSavedAlbums();
  }, [getCurrentUserSavedAlbums]);

  return <AlbumsList currentUserAlbums={currentUserAlbums} />;
};

const mapStateToProps = (state: ReduxStoreType) => ({
  currentUserAlbums: state.libraryReducer.currentUserSavedAlbums,
});

export default connect(mapStateToProps, {
  getCurrentUserSavedAlbums,
})(UserAlbumsScreen);
