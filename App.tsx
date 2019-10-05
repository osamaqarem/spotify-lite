import React from "react";
import AppWithNavigation from "./src/navigation/Navigation";
import {YellowBox} from "react-native";
import {Provider} from "react-redux";
import store from "./src/redux/store";

// from react-navigation
YellowBox.ignoreWarnings(["SafeView"]);

const AppWithStore = () => (
  <Provider store={store}>
    <AppWithNavigation />
  </Provider>
);

export default AppWithStore;
