import React from "react";
import { Text } from "react-native";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { COLORS } from "../../utils";
import UserAlbumsScreen from "../favorites/albums/UserAlbumsScreen";
import UserArtistsScreen from "../favorites/artists/UserArtistsScreen";
import UserPlaylistsScreen from "../favorites/playlists/UserPlaylistsScreen";
import HomeScreen from "../home/HomeScreen";
import PlaylistDetailsScreen from "../playlist/PlaylistDetailsScreen";
import SearchScreen from "../search/SearchScreen";
import FavoritesIcon from "./FavoritesIcon";
import HomeIcon from "./HomeIcon";
import SearchIcon from "./SearchIcon";

const sharedStyles = {
  activeColor: COLORS.white,
  inactiveColor: COLORS.itemInactive,
  barStyle: { backgroundColor: COLORS.tabBar, padding: 2 },
};

const HomeLabel = <Text style={{ fontSize: 10 }}>Home</Text>;
const SearchLabel = <Text style={{ fontSize: 10 }}>Search</Text>;
const FavoritesLabel = <Text style={{ fontSize: 10 }}>Favorites</Text>;

// Favorites tab
const NestedTopTabsNav = createMaterialTopTabNavigator(
  {
    Playlists: UserPlaylistsScreen,
    Artists: UserArtistsScreen,
    Albums: UserAlbumsScreen,
  },
  {
    initialRouteName: "Playlists",
    tabBarOptions: {
      upperCaseLabel: false,
      labelStyle: {
        fontSize: 15.5,
      },
      activeTintColor: COLORS.white,
      inactiveTintColor: COLORS.itemInactive,
      style: {
        backgroundColor: COLORS.tabBar,
        marginEnd: 130,
      },
      contentContainerStyle: {
        height: 55,
      },
      indicatorStyle: {
        backgroundColor: "#1ED760",
      },
    },
    style: {
      backgroundColor: COLORS.tabBar,
    },
  },
);

// Stack
const NestedStack = createStackNavigator(
  {
    HomeScreen,
    PlaylistDetailsScreen,
  },
  {
    // initialRouteName: "PlaylistDetailsScreen",
    headerMode: "none",
  },
);

// Main
const BottomTabsNav = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: NestedStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }: { tintColor: string }) =>
          HomeIcon(tintColor),
        ...sharedStyles,
        tabBarLabel: HomeLabel,
      },
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }: { tintColor: string }) =>
          SearchIcon(tintColor),
        ...sharedStyles,
        tabBarLabel: SearchLabel,
      },
    },
    Favorites: {
      screen: NestedTopTabsNav,
      navigationOptions: {
        tabBarIcon: ({ tintColor }: { tintColor: string }) =>
          FavoritesIcon(tintColor),
        ...sharedStyles,
        tabBarLabel: FavoritesLabel,
      },
    },
  },
  {
    initialRouteName: "Home",
  },
);

export default createAppContainer(BottomTabsNav);
