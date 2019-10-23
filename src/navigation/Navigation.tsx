import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import {
  favoritesIcon,
  FavoritesLabel,
  homeIcon,
  HomeLabel,
  searchIcon,
  SearchLabel,
} from "../components/common/TabBar";
import FavoritesScreen from "../screens/FavoritesScreen";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import { COLORS } from "../utils";

const sharedStyles = {
  activeColor: COLORS.iconSelected,
  inactiveColor: COLORS.icon,
  barStyle: { backgroundColor: COLORS.tabBar, padding: 2 },
};

const TabsNavigator = createMaterialBottomTabNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: string }) => homeIcon(tintColor),
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
    screen: FavoritesScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }: { tintColor: string }) =>
        favoritesIcon(tintColor),
      ...sharedStyles,
      tabBarLabel: FavoritesLabel,
    },
  },
});

export default createAppContainer(TabsNavigator);
