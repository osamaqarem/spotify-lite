import React, { useEffect } from "react"
import { YellowBox, Platform, UIManager } from "react-native"
import { Provider } from "react-redux"
import reactotron from "reactotron-react-native"
import { PersistGate } from "redux-persist/integration/react"
import GreenIndicator from "./src/common/components/GreenIndicator"
import AppWithNavigation from "./src/features/navigation"
import { persistor, store } from "./src/redux/store"
import SplashScreen from "react-native-splash-screen"
import ErrorBoundary from "./ErrorBoundary"

function setup() {
  if (__DEV__) {
    import("./reactotron").then(() => {
      reactotron.clear!()
      console.log("Reactotron Configured")
    })
  }

  /**
   * SafeView: from react-navigation library.
   *
   * 180000ms: React Native complains that although the interval
   * keeps on running in the background, it cannot be called.
   * In this particular case calling getRecentlyPlayed() when the
   * app comes to foreground is the better UX.
   *
   * ERR_CONNECTION_REFUSED / Encountered an error loading page: Android / iOS in the login webview,
   * we navigate to localhost which refuses connection.
   */
  YellowBox.ignoreWarnings([
    "SafeView",
    "180000ms",
    "ERR_CONNECTION_REFUSED",
    "Encountered an error loading page",
  ])

  if (Platform.OS === "android") {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }
}

setup()

const AppWithStore = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<GreenIndicator />} persistor={persistor}>
          <AppWithNavigation />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  )
}

const App = __DEV__ ? reactotron.overlay(AppWithStore) : AppWithStore

export default App
