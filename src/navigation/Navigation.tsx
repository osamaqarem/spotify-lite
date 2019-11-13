import React from "react";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import UserAlbumsScreen from "../screens/UserAlbumsScreen";
import UserArtistsScreen from "../screens/UserArtistsScreen";
import UserPlaylistsScreen from "../screens/UserPlaylistsScreen";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import { COLORS } from "../utils";
import { Text } from "react-native";
import HomeIcon from "../components/Navigation/HomeIcon";
import SearchIcon from "../components/Navigation/SearchIcon";
import FavoritesIcon from "../components/Navigation/FavoritesIcon";

const sharedStyles = {
  activeColor: COLORS.itemActive,
  inactiveColor: COLORS.itemInactive,
  barStyle: { backgroundColor: COLORS.tabBar, padding: 2 },
};

const HomeLabel = <Text style={{ fontSize: 10 }}>Home</Text>;
const SearchLabel = <Text style={{ fontSize: 10 }}>Search</Text>;
const FavoritesLabel = <Text style={{ fontSize: 10 }}>Favorites</Text>;

const FavoritesTabs = createMaterialTopTabNavigator(
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
      activeTintColor: COLORS.itemActive,
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

const TabsNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
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
      screen: FavoritesTabs,
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

export default createAppContainer(TabsNavigator);
