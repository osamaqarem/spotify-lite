import React, { RefObject } from "react";
import { Modal, YellowBox } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { LOGIN_URL } from "../../utils/_constants";
import GreenIndicator from "../common/GreenIndicator";

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
        renderError={() => <GreenIndicator />}
      />
    </Modal>
  );
};

export default LoginModal;
