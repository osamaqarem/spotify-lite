import { createStackNavigator } from "react-navigation-stack"
import { createMaterialTopTabNavigator } from "react-navigation-tabs"
import { colors } from "../../../../../common/theme"
import ArtistDetails from "../../../../artist-details/ArtistDetails"
import FavoriteAlbums from "../../../../favorites/favorite-albums/FavoriteAlbums"
import FavoriteArtists from "../../../../favorites/favorite-artists/FavoriteArtists"
import FavoritePlaylists from "../../../../favorites/favorite-playlists/FavoritePlaylists"
import PlaylistDetails from "../../../../playlist-details/PlaylistDetails"
import SafeMaterialTopTabBar from "../../SafeMaterialTopTabBar"

/**
 * Favorite tabs
 */
const TopTabsStack = createStackNavigator(
  {
    TopTabsNav: createMaterialTopTabNavigator(
      {
        FavoritePlaylists: {
          screen: FavoritePlaylists,
          navigationOptions: {
            title: "Playlists",
          },
        },
        FavoriteArtists: {
          screen: FavoriteArtists,
          navigationOptions: { title: "Artists" },
        },
        FavoriteAlbums: {
          screen: FavoriteAlbums,
          navigationOptions: { title: "Albums" },
        },
      },
      {
        tabBarComponent: SafeMaterialTopTabBar,
        tabBarOptions: {
          upperCaseLabel: false,
          labelStyle: {
            fontSize: 15.5,
          },
          activeTintColor: colors.white,
          inactiveTintColor: colors.itemInactive,
          style: {
            backgroundColor: colors.tabBar,
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
          backgroundColor: colors.tabBar,
        },
      },
    ),
    PlaylistDetails,
    ArtistDetails,
  },
  { headerMode: "none" },
)

export default TopTabsStack
