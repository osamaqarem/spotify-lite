import React, {useRef, useState} from "react";
import {WebViewNavigation} from "react-native-webview";
import Home from "../components/Home";
import {madeForYou, recentlyPlayed, recommendedForYou} from "../data/home";
import secret from "../../secret";
import {Base64} from "../utils/_helpers";
import {SPOTIFY_API_BASE} from "../utils/_vars";
import {AccessTokenResponse} from "../utils/types/spotify";

// TODO:
// redux
// redux-observable for fun
const getToken = async (code: string) => {
  try {
    const encoded = Base64.btoa(secret.clientId + ":" + secret.clientSecret);

    const res = await fetch(`${SPOTIFY_API_BASE}/api/token`, {
      method: "POST",
      headers: {
        authorization: `Basic ${encoded}`,
      },
      body: {
        code,
        // eslint-disable-next-line
        grant_type: "authorization_code",
        // eslint-disable-next-line
        redirect_uri: "http://localhost:8000",
      },
    });

    const resJson: AccessTokenResponse = await res.json();
  } catch (err) {}
};

const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const webViewRef = useRef(null);

  const handleNav = (e: WebViewNavigation) => {
    if (e.url.includes("http://localhost:8000") && isVisible) {
      setIsLoading(true);
      const [, authCode] = e.url.split("?code=");
      console.log(authCode);
      // TODO: dispatch get user token/user data
    }
  };

  const loginModalProps = {
    isVisible,
    webViewRef,
    handleNav,
    isLoading,
  };

  return (
    <Home
      data={{
        madeForYou,
        recentlyPlayed,
        recommendedForYou,
        loginModalProps,
      }}
    />
  );
};

export default HomeScreen;
