import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import createAnimatedSwitchNavigator from "react-navigation-animated-switch";
import Login from "../login/Login";
import createConnectedBottomTabsNav from "./custom-navigators/createConnectedBottomTabsNav";
import { Transition } from "react-native-reanimated";

export default createAppContainer(
  createAnimatedSwitchNavigator(
    {
      AppTabs: createConnectedBottomTabsNav(),
      LoginStack: createStackNavigator({ Login }, { headerMode: "none" }),
    },
    {
      initialRouteName: "LoginStack",
      transition: (
        <Transition.Together>
          <Transition.Out
            type="slide-left"
            durationMs={400}
            interpolation="easeIn"
          />
          <Transition.In type="slide-right" durationMs={400} />
        </Transition.Together>
      ),
    },
  ),
);
