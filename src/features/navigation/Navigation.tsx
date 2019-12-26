import React, { useEffect } from "react";
import { Text } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import {
  createStackNavigator,
  NavigationStackProp,
} from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { COLORS, Routes } from "../../utils";
import FavoriteAlbumsScreen from "../favorites/favorite-albums/FavoriteAlbumsScreen";
import FavoriteArtistsScreen from "../favorites/favorite-artists/FavoriteArtistsScreen";
import FavoritePlaylistsScreen from "../favorites/favorite-playlists/FavoritePlaylistsScreen";
import HomeScreen from "../home/HomeScreen";
import PlaylistDetailsScreen from "../playlist-details/PlaylistDetailsScreen";
import SearchScreen from "../search/SearchScreen";
import FavoritesIcon from "./FavoritesIcon";
import HomeIcon from "./HomeIcon";
import SearchIcon from "./SearchIcon";
import ArtistDetailsScreen from "../artist-details/ArtistDetailsScreen";
import LoginScreen from "../login/LoginScreen";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../redux/store";

const sharedStyles = {
  activeColor: COLORS.white,
  inactiveColor: COLORS.itemInactive,
  barStyle: { backgroundColor: COLORS.tabBar, padding: 2 },
};

const HomeLabel = <Text style={{ fontSize: 10 }}>Home</Text>;
const SearchLabel = <Text style={{ fontSize: 10 }}>Search</Text>;
const FavoritesLabel = <Text style={{ fontSize: 10 }}>Favorites</Text>;

/**
 * Favorite tabs
 */
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

/**
 * Bottom tabs (main)
 */
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

/**
 * This navigator will observe `authenticated` from redux store, and navigate to
 * login screen if it is false.
 */
const AuthAwareNav = (
  props: ReduxProps & { navigation: NavigationStackProp },
) => {
  const { navigation, authenticated } = props;

  useEffect(() => {
    if (!authenticated) {
      navigation.navigate(Routes.AuthFlow.AuthStack);
    }
  }, [authenticated, navigation]);

  return <BottomTabsNav navigation={navigation} />;
};

AuthAwareNav.router = BottomTabsNav.router;

const mapStateToProps = (state: RootStoreType) => ({
  authenticated: state.userReducer.authenticated,
});

const connector = connect(mapStateToProps, {});

type ReduxProps = ConnectedProps<typeof connector>;

const AuthAwareWithRedux = connector(AuthAwareNav);

/**
 * App/Auth switch navigator
 */
const AppStack = createStackNavigator(
  { AuthAwareWithRedux },
  { headerMode: "none" },
);

const AuthStack = createStackNavigator({ LoginScreen }, { headerMode: "none" });

const StackSwitcher = createSwitchNavigator(
  { AppStack, AuthStack },
  { initialRouteName: "AuthStack" },
);

export default createAppContainer(StackSwitcher);
