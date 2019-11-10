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
import FavAlbumsScreens from "../screens/FavAlbumsScreens";
import FavArtistsScreen from "../screens/FavArtistsScreen";
import FavPlaylistScreen from "../screens/FavPlaylistScreen";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import { COLORS } from "../utils";

const sharedStyles = {
  activeColor: COLORS.itemActive,
  inactiveColor: COLORS.itemInactive,
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
    initialRouteName: "Home",
  },
);

export default createAppContainer(TabsNavigator);
