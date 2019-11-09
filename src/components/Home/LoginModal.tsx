import React, { RefObject } from "react";
import { ActivityIndicator, Modal, View, YellowBox } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import secret from "../../../secret";
import { SPOTIFY_ACCOUNTS, SPOTIFY_REDIRECT_URI } from "../../utils";

// localhost refused connection.
YellowBox.ignoreWarnings(["ERR_CONNECTION_REFUSED"]);

export type LoginModalType = {
  isVisible: boolean;
  webViewRef: RefObject<WebView>;
  pushNavEvent: (e: WebViewNavigation) => void;
};

const scopes =
  "user-read-private user-read-recently-played user-top-read playlist-read-private user-library-read user-follow-read";

// WebView URL for obtaining auth code from Spotify.
// Has:
// 1- client_id
// 2- client_secret
// 3- response_type
// 4- redirect_uri
// 5- scope
const uri = `${SPOTIFY_ACCOUNTS}/authorize?client_id=${
  secret.clientId
}&response_type=code&redirect_uri=${encodeURIComponent(
  SPOTIFY_REDIRECT_URI,
)}&scope=${encodeURIComponent(scopes)}`;

const LoginModal = ({
  webViewRef,
  pushNavEvent,
  isVisible,
}: LoginModalType) => {
  return (
    <Modal animationType="fade" visible={isVisible}>
      <WebView
        ref={webViewRef}
        onNavigationStateChange={pushNavEvent}
        source={{
          uri,
        }}
        renderError={() => (
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
      />
    </Modal>
  );
};

export default LoginModal;
