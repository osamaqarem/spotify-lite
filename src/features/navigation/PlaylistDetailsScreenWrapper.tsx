import React from "react";
import { NavigationEvents } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { hideTabBar, showTabBar } from "../../redux/actions";
import PlaylistDetailsScreen from "../playlist-details/PlaylistDetailsScreen";

const PlaylistDetailsScreenWrapper = ({
  navigation,
  showTabBar,
  hideTabBar,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  return (
    <>
      <NavigationEvents onWillFocus={hideTabBar} onWillBlur={showTabBar} />
      <PlaylistDetailsScreen navigation={navigation} />
    </>
  );
};

const mapDispatchToProps = { showTabBar, hideTabBar };

const connector = connect(() => ({}), mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(PlaylistDetailsScreenWrapper);
