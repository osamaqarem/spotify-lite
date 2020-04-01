import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { StatusBar } from "react-native"
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"
import { WebView, WebViewNavigation } from "react-native-webview"
import { SafeAreaView } from "react-navigation"
import { NavigationStackProp } from "react-navigation-stack"
import { connect, ConnectedProps } from "react-redux"
import { Subject } from "rxjs"
import { debounceTime, filter, map, take } from "rxjs/operators"
import GreenIndicator from "../../common/components/GreenIndicator"
import TopBar from "../../common/components/TopBar"
import { colors } from "../../common/theme"
import { hydrate } from "../../redux/slices/globalSlice"
import { setToken } from "../../redux/slices/userSlice"
import { RootStoreType } from "../../redux/rootReducer"
import SpotifyEndpoints from "../../services/network/SpotifyEndpoints"
import { Routes } from "../navigation/_routes"

const webViewSub$ = new Subject<string>()

const Login = ({
  setToken,
  authenticated,
  navigation,
  hydrate,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const webViewRef = useRef<WebView | null>(null)
  const [showBack, setShowBack] = useState(false)

  const handleToken = useCallback(
    (token: string) => {
      setToken(token)
    },
    [setToken],
  )

  /**
   * Subscribes to our navigation URL event stream.
   */
  useEffect(() => {
    // Pulls the URL with the access token from the stream
    const webView$ = webViewSub$.pipe(
      filter(v => v.includes("#access_token=")),
      debounceTime(1000),
      take(1),
      // Expected pattern: ...#access_token=123456&token_type=Bearer&expires_in=3600
      map(res => res.split("#access_token=")[1].split("&token_type=")[0]),
    )

    const sub = webView$.subscribe(handleToken)
    return () => {
      sub.unsubscribe()
    }
  }, [handleToken])

  useLayoutEffect(() => {
    if (authenticated) {
      //TODO: don't navigate to bottomtabs if refreshing token,
      // go back instead.
      hydrate()
      navigation.navigate(Routes.BottomTabs.navigator)
    }
  }, [authenticated, navigation, hydrate])

  /**
   * Feed URL values to the stream on every URL change
   */
  const handleNavEvent = (e: WebViewNavigation) => {
    webViewSub$.next(e.url)

    if (e.canGoBack) {
      setShowBack(true)
    } else if (showBack) {
      setShowBack(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.tabBar }}>
      <StatusBar barStyle="light-content" />
      <TopBar title="Login">
        {showBack && (
          <MaterialCommunityIcon
            onPress={() => {
              if (webViewRef.current instanceof WebView) {
                webViewRef.current.goBack()
              }
            }}
            name="arrow-left"
            size={24}
            color={colors.white}
            style={{
              position: "absolute",
              left: 15,
              justifyContent: "center",
              textAlignVertical: "center",
              padding: 10,
            }}
          />
        )}
      </TopBar>
      <WebView
        cacheMode="LOAD_NO_CACHE"
        cacheEnabled={false}
        style={{
          backgroundColor: colors.background,
        }}
        ref={webViewRef}
        onNavigationStateChange={handleNavEvent}
        source={{
          uri: SpotifyEndpoints.login(),
        }}
        renderError={() => <GreenIndicator />}
      />
    </SafeAreaView>
  )
}

const mapStateToProps = (state: RootStoreType) => ({
  authenticated: state.userReducer.authenticated,
})

const mapDispatchToProps = {
  setToken,
  hydrate,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(Login)
