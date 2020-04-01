import React from "react"
import { Text } from "react-native"
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"
import {
  createStackNavigator,
  NavigationStackProp,
} from "react-navigation-stack"
import UIHelper from "../../../../../common/helpers/UIHelper"
import { colors } from "../../../../../common/theme"
import ArtistDetails from "../../../../artist-details/ArtistDetails"
import Explore from "../../../../explore/Explore"
import Genre from "../../../../explore/genre/Genre"
import Search from "../../../../explore/search/Search"
import SeeAll from "../../../../explore/search/see-all/SeeAll"
import Home from "../../../../home/Home"
import StickyPlayer from "../../../../player/StickyPlayer"
import PlaylistDetails from "../../../../playlist-details/PlaylistDetails"
import ProtectedRoute from "../../ProtectedRoute"
import TopTabsStack from "../top-tabs/TopTabsStack"
import FavoritesIcon from "./icons/FavoritesIcon"
import HomeIcon from "./icons/HomeIcon"
import SearchIcon from "./icons/SearchIcon"

const BAR_HEIGHT = UIHelper.isIphoneX() ? 78 : 58

const createProtectedBottomTabsNav = () => {
  const BottomTabsNav = createMaterialBottomTabNavigator(
    {
      HomeStack: {
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
          tabBarLabel: <HomeLabel />,
        },
      },
      ExploreStack: {
        screen: createStackNavigator(
          {
            Explore,
            Search,
            Genre,
            PlaylistDetails,
            ArtistDetails,
            SeeAll,
          },
          {
            headerMode: "none",
            transitionConfig: () => UIHelper.fadeIn(),
          },
        ),
        navigationOptions: {
          tabBarIcon: SearchIcon,
          tabBarLabel: <SearchLabel />,
        },
      },
      FavoritesStack: {
        screen: TopTabsStack,
        navigationOptions: {
          tabBarIcon: FavoritesIcon,
          tabBarLabel: <FavoritesLabel />,
        },
      },
    },
    {
      initialRouteName: "HomeStack",
      barStyle: {
        backgroundColor: colors.tabBar,
        padding: 2,
        height: BAR_HEIGHT,
      },
      activeColor: colors.white,
      inactiveColor: colors.itemInactive,
    },
  )

  /**
   * This navigator will observe `authenticated` from redux store, and navigate to login screen if it is false.
   */
  const ConnectedBottomTabsNav = ({
    navigation,
  }: {
    navigation: NavigationStackProp
  }) => {
    return (
      <ProtectedRoute navigation={navigation}>
        <StickyPlayer barHeight={BAR_HEIGHT} />
        <BottomTabsNav navigation={navigation} />
      </ProtectedRoute>
    )
  }

  ConnectedBottomTabsNav.router = BottomTabsNav.router

  return ConnectedBottomTabsNav
}

const HomeLabel = () => <Text style={{ fontSize: 10 }}>Home</Text>
const SearchLabel = () => <Text style={{ fontSize: 10 }}>Search</Text>
const FavoritesLabel = () => <Text style={{ fontSize: 10 }}>Favorites</Text>

export default createProtectedBottomTabsNav
