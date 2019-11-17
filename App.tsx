import React from "react";
import AppWithNavigation from "./src/features/navigation/Navigation";
import { YellowBox } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import redux from "./src/redux/store";
import GreenIndicator from "./src/features/common/GreenIndicator";
if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

// from react-navigation
YellowBox.ignoreWarnings(["SafeView"]);

const AppWithStore = () => (
  <Provider store={redux.store}>
    <PersistGate loading={<GreenIndicator />} persistor={redux.persistor}>
      <AppWithNavigation />
    </PersistGate>
  </Provider>
);

export default AppWithStore;
