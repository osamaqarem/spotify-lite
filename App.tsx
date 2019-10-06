import React from "react";
import AppWithNavigation from "./src/navigation/Navigation";
import { YellowBox } from "react-native";
import { Provider } from "react-redux";
import store from "./src/redux/store";
if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

// from react-navigation
YellowBox.ignoreWarnings(["SafeView"]);

const AppWithStore = () => (
  <Provider store={store}>
    <AppWithNavigation />
  </Provider>
);

export default AppWithStore;
