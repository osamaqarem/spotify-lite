import React, {RefObject} from "react";
import {Modal, YellowBox, View, Text, ActivityIndicator} from "react-native";
import {WebView, WebViewNavigation} from "react-native-webview";
import secret from "../../secret";
import {SPOTIFY_API_BASE} from "../utils/_vars";

// localhost refused connection.
YellowBox.ignoreWarnings(["ERR_CONNECTION_REFUSED"]);

export type LoginModalType = {
  isLoading: boolean;
  isVisible: boolean;
  webViewRef: RefObject<WebView>;
  handleNav: (e: WebViewNavigation) => void;
};

const LoginModal = ({
  isLoading,
  isVisible,
  webViewRef,
  handleNav,
}: LoginModalType) => {
  return (
    <Modal visible={isVisible} animationType="fade">
      {isLoading && (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            top: 0,
            left: 0,
            backgroundColor: "#000",
          }}>
          <ActivityIndicator size={60} color="darkgreen" />
        </View>
      )}
      <WebView
        ref={webViewRef}
        onNavigationStateChange={handleNav}
        source={{
          uri: `${SPOTIFY_API_BASE}/authorize?client_id=${secret.clientId}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=user-read-private`,
        }}
        renderError={() => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}>
            <Text style={{fontSize: 24}}>EVERYTHING IS FINE 👍</Text>
          </View>
        )}
      />
    </Modal>
  );
};

export default LoginModal;
