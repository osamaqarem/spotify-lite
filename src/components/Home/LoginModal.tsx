import React, { RefObject } from "react";
import { ActivityIndicator, Modal, View, YellowBox } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { LOGIN_URL } from "../../utils/_constants";

// localhost refused connection.
YellowBox.ignoreWarnings(["ERR_CONNECTION_REFUSED"]);

export type LoginModalType = {
  isVisible: boolean;
  webViewRef: RefObject<WebView>;
  pushNavEvent: (e: WebViewNavigation) => void;
};

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
          uri: LOGIN_URL,
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
