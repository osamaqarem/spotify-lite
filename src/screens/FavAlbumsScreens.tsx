import React, { useEffect } from "react";
import { connect } from "react-redux";
import AlbumsList from "../components/Favorites/AlbumsList";
import { getCurrentUserSavedAlbums } from "../redux/actions";

const FavAlbumsScreens = ({
  getCurrentUserSavedAlbums,
  currentUserAlbums,
}: {
  getCurrentUserSavedAlbums: () => void;
  currentUserAlbums: { name: string; url: string; owner: string };
}) => {
  useEffect(() => {
    getCurrentUserSavedAlbums();
  }, [getCurrentUserSavedAlbums]);

  return <AlbumsList currentUserAlbums={currentUserAlbums} />;
};

const mapStateToProps = (state: any) => ({
  currentUserAlbums: state.libraryReducer.currentUserSavedAlbums,
});

export default connect(
  mapStateToProps,
  {
    getCurrentUserSavedAlbums,
  },
)(FavAlbumsScreens);
