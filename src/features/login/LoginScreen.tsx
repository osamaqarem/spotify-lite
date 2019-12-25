import React, { useEffect, useRef, useState, useCallback } from "react";
import { View } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { WebView, WebViewNavigation } from "react-native-webview";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { Subject } from "rxjs";
import { debounceTime, filter, map, take } from "rxjs/operators";
import { setToken, rehydrate } from "../../redux/actions";
import { RootStoreType } from "../../redux/store";
import { COLORS, LOGIN_URL, Routes } from "../../utils/_constants";
import GreenIndicator from "../../components/GreenIndicator";
import TopBar from "../../components/TopBar";
const webViewSub$: Subject<string> = new Subject();

const LoginScreen = ({
  setToken,
  authenticated,
  navigation,
  rehydrate,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const webViewRef = useRef<WebView | null>(null);
  const [showBack, setShowBack] = useState(false);

  const handleToken = useCallback(
    (token: string) => {
      setToken(token);
    },
    [setToken],
  );

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
    );

    const sub = webView$.subscribe(handleToken);
    return () => {
      sub.unsubscribe();
    };
  }, [handleToken]);

  useEffect(() => {
    if (authenticated) {
      rehydrate();
      navigation.navigate(Routes.AuthFlow.AppStack);
    }
  }, [authenticated, navigation, rehydrate]);

  /**
   *
   * Feed URL values to the stream on every URL change
   */
  const handleNavEvent = (e: WebViewNavigation) => {
    webViewSub$.next(e.url);

    if (e.canGoBack) {
      setShowBack(true);
    } else if (showBack) {
      setShowBack(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar title="Login">
        {showBack && (
          <MaterialCommunityIcon
            onPress={() => {
              if (webViewRef.current instanceof WebView) {
                webViewRef.current.goBack();
              }
            }}
            name="arrow-left"
            size={24}
            color={COLORS.white}
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
          backgroundColor: COLORS.background,
        }}
        ref={webViewRef}
        onNavigationStateChange={handleNavEvent}
        source={{
          uri: LOGIN_URL,
        }}
        renderError={() => <GreenIndicator />}
      />
    </View>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  authenticated: state.userReducer.authenticated,
});

const mapDispatchToProps = {
  setToken,
  rehydrate,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(LoginScreen);
