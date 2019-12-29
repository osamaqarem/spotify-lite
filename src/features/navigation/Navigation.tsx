import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Login from "../login/Login";
import createConnectedBottomTabsNav from "./custom-navigators/createConnectedBottomTabsNav";

export default createAppContainer(
  createSwitchNavigator(
    {
      AppTabs: createConnectedBottomTabsNav(),
      LoginStack: createStackNavigator({ Login }, { headerMode: "none" }),
    },
    { initialRouteName: "LoginStack" },
  ),
);
