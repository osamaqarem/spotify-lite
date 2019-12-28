import React, { useEffect } from "react";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import ListOfArtists from "../../../components/ListOfArtists";
import {
  getCurrentUserSavedArtists,
  setArtistId,
} from "../../../redux/actions";
import { RootStoreType } from "../../../redux/store";
import { Routes } from "../../../utils";

const FavoriteArtistsScreen = ({
  getCurrentUserSavedArtists,
  currentUserArtists,
  navigation,
  setArtistId,
}: ReduxProps & {
  navigation: NavigationStackProp;
}) => {
  useEffect(() => {
    getCurrentUserSavedArtists();
  }, [getCurrentUserSavedArtists]);

  const onArtistPressed = (id: string | undefined) => {
    if (id) {
      setArtistId(id);
      navigation.navigate(Routes.DetailsRoutes.ArtistDetails);
    }
  };

  return (
    <ListOfArtists
      currentUserArtists={currentUserArtists}
      onArtistPressed={onArtistPressed}
    />
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  currentUserArtists: state.followRedcuer.currentUserSavedArtists,
});

const mapDispatchToProps = {
  getCurrentUserSavedArtists,
  setArtistId,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(FavoriteArtistsScreen);
