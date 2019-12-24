import React from "react";
import { Text } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { COLORS } from "../../utils";
import FavoriteAlbumsScreen from "../favorites/FavoriteAlbumsScreen";
import FavoriteArtistsScreen from "../favorites/FavoriteArtistsScreen";
import FavoritePlaylistsScreen from "../favorites/FavoritePlaylistsScreen";
import HomeScreen from "../home/HomeScreen";
import PlaylistDetailsScreen from "../playlist/PlaylistDetailsScreen";
import SearchScreen from "../search/SearchScreen";
import FavoritesIcon from "./FavoritesIcon";
import HomeIcon from "./HomeIcon";
import SearchIcon from "./SearchIcon";
import ArtistDetailsScreen from "../artist/ArtistDetailsScreen";
import LoginScreen from "../auth/LoginScreen";

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
    Playlists: FavoritePlaylistsScreen,
    Artists: FavoriteArtistsScreen,
    Albums: FavoriteAlbumsScreen,
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
const DetailsStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    PlaylistDetails: {
      screen: PlaylistDetailsScreen,
    },
    ArtistDetails: {
      screen: ArtistDetailsScreen,
    },
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
      screen: DetailsStack,
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

const AppStack = createStackNavigator(
  { BottomTabsNav },
  { headerMode: "none" },
);
const AuthStack = createStackNavigator({ LoginScreen }, { headerMode: "none" });

const StackSwitcher = createSwitchNavigator(
  { AppStack, AuthStack },
  { initialRouteName: "AuthStack" },
);

export default createAppContainer(StackSwitcher);
