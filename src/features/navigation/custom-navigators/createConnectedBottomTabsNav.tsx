import React from "react";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import {
  createStackNavigator,
  NavigationStackProp,
} from "react-navigation-stack";
import ArtistDetails from "../../artist-details/ArtistDetails";
import Home from "../../home/Home";
import PlaylistDetails from "../../playlist-details/PlaylistDetails";
import Explore from "../../explore/Explore";
import FavoritesIcon from "../icons/FavoritesIcon";
import HomeIcon from "../icons/HomeIcon";
import SearchIcon from "../icons/SearchIcon";
import ProtectedRoute from "../hoc/ProtectedRoute";
import { COLORS } from "../../../utils";
import { Text } from "react-native";
import TopTabsNav from "../navigators/TopTabsNav";
import Genre from "../../explore/genre/Genre";
import Search from "../../explore/search/Search";

const createConnectedBottomTabsNav = () => {
  const BottomTabsNav = createMaterialBottomTabNavigator({
    Home: {
      screen: createStackNavigator(
        {
          Home,
          PlaylistDetails,
          ArtistDetails,
        },
        {
          headerMode: "none",
        },
      ),
      navigationOptions: {
        tabBarIcon: HomeIcon,
        ...sharedStyles,
        tabBarLabel: <HomeLabel />,
      },
    },
    Search: {
      screen: createStackNavigator(
        {
          Explore,
          Search,
          Genre,
          PlaylistDetails,
        },
        {
          headerMode: "none",
        },
      ),
      navigationOptions: {
        tabBarIcon: SearchIcon,
        ...sharedStyles,
        tabBarLabel: <SearchLabel />,
      },
    },
    Favorites: {
      screen: TopTabsNav,
      navigationOptions: {
        tabBarIcon: FavoritesIcon,
        ...sharedStyles,
        tabBarLabel: <FavoritesLabel />,
      },
    },
  });

  /**
   * This navigator will observe `authenticated` from redux store, and navigate to
   * login screen if it is false.
   */
  const ConnectedBottomTabsNav = ({
    navigation,
  }: {
    navigation: NavigationStackProp;
  }) => {
    return (
      <ProtectedRoute navigation={navigation}>
        <BottomTabsNav navigation={navigation} />
      </ProtectedRoute>
    );
  };

  ConnectedBottomTabsNav.router = BottomTabsNav.router;

  return ConnectedBottomTabsNav;
};

const sharedStyles = {
  activeColor: COLORS.white,
  inactiveColor: COLORS.itemInactive,
  barStyle: { backgroundColor: COLORS.tabBar, padding: 2 },
};

const HomeLabel = () => <Text style={{ fontSize: 10 }}>Home</Text>;
const SearchLabel = () => <Text style={{ fontSize: 10 }}>Search</Text>;
const FavoritesLabel = () => <Text style={{ fontSize: 10 }}>Favorites</Text>;

export default createConnectedBottomTabsNav;
