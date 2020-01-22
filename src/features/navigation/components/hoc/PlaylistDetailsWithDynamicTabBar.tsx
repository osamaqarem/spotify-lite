import React from "react";
import { NavigationEvents } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { hideTabBar, showTabBar } from "../../../../redux/actions";
import PlaylistDetails from "../../../playlist-details/PlaylistDetails";

// Nav event logic for hiding and showing the material top tab bar.
const PlaylistDetailsWithDynamicTabBar = ({
  navigation,
  showTabBar,
  hideTabBar,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  return (
    <>
      <NavigationEvents onWillFocus={hideTabBar} onWillBlur={showTabBar} />
      <PlaylistDetails navigation={navigation} />
    </>
  );
};

const mapDispatchToProps = { showTabBar, hideTabBar };

const connector = connect(() => ({}), mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(PlaylistDetailsWithDynamicTabBar);
