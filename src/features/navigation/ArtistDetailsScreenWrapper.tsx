import React from "react";
import { NavigationEvents } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { hideTabBar, showTabBar } from "../../redux/actions";
import ArtistDetailsScreen from "../artist-details/ArtistDetailsScreen";

const ArtistDetailsScreenWrapper = ({
  navigation,
  showTabBar,
  hideTabBar,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  return (
    <>
      <NavigationEvents
        onWillBlur={() => {
          // if the parents index is 0 then its the first screen in the stack navigator (Artists tab).
          const { index } = navigation.dangerouslyGetParent()!.state;
          if (index === 0) {
            showTabBar();
          }
        }}
        onWillFocus={() => {
          const { index } = navigation.dangerouslyGetParent()!.state;
          if (index !== 0) {
            hideTabBar();
          }
        }}
      />
      <ArtistDetailsScreen navigation={navigation} />
    </>
  );
};

const mapDispatchToProps = { showTabBar, hideTabBar };

const connector = connect(() => ({}), mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ArtistDetailsScreenWrapper);
