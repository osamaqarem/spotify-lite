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

/**
 * SafeView: from react-navigation library.
 *
 * 180000ms: React Native complains that although the interval
 * keeps on running in the background, it cannot be called.
 * In this particular case calling getRecentlyPlayed() when the
 * app comes to foreground is the better UX.
 *
 * ERR_CONNECTION_REFUSED: in @function LoginModal we navigate to localhost
 * which refuses connection.
 */
YellowBox.ignoreWarnings(["SafeView", "180000ms", "ERR_CONNECTION_REFUSED"]);

const AppWithStore = () => (
  <Provider store={redux.store}>
    <PersistGate loading={<GreenIndicator />} persistor={redux.persistor}>
      <AppWithNavigation />
    </PersistGate>
  </Provider>
);

export default AppWithStore;
