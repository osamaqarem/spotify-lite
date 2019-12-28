import { Dimensions } from "react-native";

export const COLORS = {
  tabBar: "#222326",
  itemInactive: "#ADAEB3",
  background: "#121212",
  white: "#FFFFFF",
  darkWhite: "#FDFDFD",
  green: "#1DB954",
  grey: "#B9B9B9",
  darkGrey: "#5A5A5A",
};

// Route names
export const Routes = {
  DetailsRoutes: {
    Home: "Home",
    PlaylistDetails: "PlaylistDetails",
    ArtistDetails: "ArtistDetails",
  },
  Tabs: {
    Playlists: "Playlists",
    Artists: "Artists",
    Albums: "Albums",
  },
  AppRoutes: {
    Home: "Home",
    Search: "Search",
    Favorites: "Favorites",
  },
  AuthRoutes: {
    AuthStack: "AuthStack",
    AppStack: "AppStack",
  },
};

export const { height, width } = Dimensions.get("window");

export const MAGIC_NUM = 1000;
export const ratio = (width / 414 / height) * MAGIC_NUM;

export const SPOTIFY_ACCOUNTS = "https://accounts.spotify.com";

export const SPOTIFY_API_BASE = "https://api.spotify.com";

export const SPOTIFY_REDIRECT_URI = "http://localhost:8000";

export const SCOPES =
  "user-read-private user-read-recently-played user-top-read playlist-read-private user-library-read user-follow-read";

// WebView URL for obtaining auth code from Spotify.
// Has:
// 1- client_id
// 2- client_secret
// 3- response_type
// 4- redirect_uri
// 5- scope
const clientId = "47417b69c3c0446e99d34e207a505b4e";
const responseType = "token";
const showDialog = "false";

export const LOGIN_URL = `${SPOTIFY_ACCOUNTS}/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(
  SPOTIFY_REDIRECT_URI,
)}&scope=${encodeURIComponent(SCOPES)}&show_dialog=${showDialog}`;
