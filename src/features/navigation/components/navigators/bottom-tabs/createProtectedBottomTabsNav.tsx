import React from "react"
import { Text } from "react-native"
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs"
import {
  createStackNavigator,
  NavigationStackProp,
} from "react-navigation-stack"
import { colors } from "../../../../../common/theme"
import ArtistDetails from "../../../../artist-details/ArtistDetails"
import Explore from "../../../../explore/Explore"
import Genre from "../../../../explore/genre/Genre"
import Search from "../../../../explore/search/Search"
import Home from "../../../../home/Home"
import PlaylistDetails from "../../../../playlist-details/PlaylistDetails"
import FavoritesIcon from "./icons/FavoritesIcon"
import ProtectedRoute from "../../ProtectedRoute"
import HomeIcon from "./icons/HomeIcon"
import SearchIcon from "./icons/SearchIcon"
import TopTabsStack from "../top-tabs/TopTabsStack"
import UIHelper from "../../../../../common/helpers/UIHelper"
import SeeAll from "../../../../explore/search/see-all/SeeAll"

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
          ...sharedStyles,
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
          ...sharedStyles,
          tabBarLabel: <SearchLabel />,
        },
      },
      FavoritesStack: {
        screen: TopTabsStack,
        navigationOptions: {
          tabBarIcon: FavoritesIcon,
          ...sharedStyles,
          tabBarLabel: <FavoritesLabel />,
        },
      },
    },
    {
      initialRouteName: "HomeStack",
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
        <BottomTabsNav navigation={navigation} />
      </ProtectedRoute>
    )
  }

  ConnectedBottomTabsNav.router = BottomTabsNav.router

  return ConnectedBottomTabsNav
}

const sharedStyles = {
  activeColor: colors.white,
  inactiveColor: colors.itemInactive,
  barStyle: { backgroundColor: colors.tabBar, padding: 2 },
}

const HomeLabel = () => <Text style={{ fontSize: 10 }}>Home</Text>
const SearchLabel = () => <Text style={{ fontSize: 10 }}>Search</Text>
const FavoritesLabel = () => <Text style={{ fontSize: 10 }}>Favorites</Text>

export default createProtectedBottomTabsNav
