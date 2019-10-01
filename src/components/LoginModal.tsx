import React, {useRef, useState} from "react";
import {ActivityIndicator, Modal, Text, View, YellowBox} from "react-native";
import {WebView, WebViewNavigation} from "react-native-webview";
import secret from "../../secret";

YellowBox.ignoreWarnings(["localhost"]);

const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const handleNav = (e: WebViewNavigation) => {
    if (e.url.includes("http://localhost:8000") && !loading) {
      setLoading(true);
      console.log(e.url);
    }
  };

  return (
    <Modal visible={true}>
      {loading && (
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
        ref={ref}
        onNavigationStateChange={handleNav}
        source={{
          uri: `https://accounts.spotify.com/authorize?client_id=${secret.clientId}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000&scope=user-read-private`,
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
