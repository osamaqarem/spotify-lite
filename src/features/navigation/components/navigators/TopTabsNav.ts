import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { COLORS } from "../../../../utils";
import FavoriteAlbums from "../../../favorites/favorite-albums/FavoriteAlbums";
import FavoriteArtists from "../../../favorites/favorite-artists/FavoriteArtists";
import FavoritePlaylists from "../../../favorites/favorite-playlists/components/FavoritePlaylists";
import ArtistDetailsWithDynamicTabBar from "../hoc/ArtistDetailsWithDynamicTabBar";
import HideableMaterialTopTabBar from "../hoc/HideableMaterialTopTabBar";
import PlaylistDetailsWithDynamicTabBar from "../hoc/PlaylistDetailsWithDynamicTabBar";

/**
 * Favorite tabs
 */
const TopTabsNav = createMaterialTopTabNavigator(
  {
    FavoritePlaylists: {
      screen: createStackNavigator(
        {
          FavoritePlaylists,
          PlaylistDetails: {
            screen: PlaylistDetailsWithDynamicTabBar,
          },
        },
        {
          headerMode: "none",
        },
      ),
      navigationOptions: {
        title: "Playlists",
      },
    },
    FavoriteArtists: {
      screen: createStackNavigator(
        {
          FavoriteArtists,
          ArtistDetails: {
            screen: ArtistDetailsWithDynamicTabBar,
          },
        },
        {
          headerMode: "none",
        },
      ),
      navigationOptions: { title: "Artists" },
    },
    FavoriteAlbums: {
      screen: createStackNavigator(
        {
          FavoriteAlbums,
          PlaylistDetails: {
            screen: PlaylistDetailsWithDynamicTabBar,
          },
        },
        {
          headerMode: "none",
        },
      ),
      navigationOptions: { title: "Albums" },
    },
  },
  {
    tabBarComponent: HideableMaterialTopTabBar,
    tabBarOptions: {
      upperCaseLabel: false,
      labelStyle: {
        fontSize: 15.5,
      },
      activeTintColor: COLORS.white,
      inactiveTintColor: COLORS.itemInactive,
      style: {
        backgroundColor: COLORS.tabBar,
        elevation: 0,
        marginEnd: 100,
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

export default TopTabsNav;
