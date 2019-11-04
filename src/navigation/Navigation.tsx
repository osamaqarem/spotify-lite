import React from "react";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import {
  favoritesIcon,
  FavoritesLabel,
  homeIcon,
  HomeLabel,
  searchIcon,
  SearchLabel,
} from "../components/common/TabBar";
import FavPlaylistScreen from "../screens/Favorites/FavPlaylistScreen";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import { COLORS } from "../utils";
import FavArtistsScreen from "../screens/Favorites/FavArtistsScreen";
import FavAlbumsScreens from "../screens/Favorites/FavAlbumsScreens";
import { View, Text } from "react-native";
import reactotron from "../../ReactotronConfig";

const sharedStyles = {
  activeColor: COLORS.iconSelected,
  inactiveColor: COLORS.icon,
  barStyle: { backgroundColor: COLORS.tabBar, padding: 2 },
};

const FavoritesTabs = createMaterialTopTabNavigator(
  {
    Playlists: {
      screen: FavPlaylistScreen,
    },
    Artists: {
      screen: FavArtistsScreen,
    },
    Albums: {
      screen: FavAlbumsScreens,
    },
  },
  {
    initialRouteName: "Playlists",
    tabBarOptions: {
      upperCaseLabel: false,
      labelStyle: {
        fontSize: 14,
        textAlign: "left",
        marginEnd: "25%",
      },
      activeTintColor: "#FFFFFF",
      inactiveTintColor: "#ADAEB3",
      style: {
        backgroundColor: "#222326",
      },
      contentContainerStyle: {
        height: 55,
        marginEnd: "25%",
        maxWidth: "80%",
      },
      indicatorStyle: {
        backgroundColor: "#1ED760",
        maxWidth: "80%",
      },
    },
  },
);

const TabsNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }: { tintColor: string }) =>
          homeIcon(tintColor),
        ...sharedStyles,
        tabBarLabel: HomeLabel,
      },
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }: { tintColor: string }) =>
          searchIcon(tintColor),
        ...sharedStyles,
        tabBarLabel: SearchLabel,
      },
    },
    Favorites: {
      screen: FavoritesTabs,
      navigationOptions: {
        tabBarIcon: ({ tintColor }: { tintColor: string }) =>
          favoritesIcon(tintColor),
        ...sharedStyles,
        tabBarLabel: FavoritesLabel,
      },
    },
  },
  {
    initialRouteName: "Favorites",
  },
);

export default createAppContainer(TabsNavigator);
