import secret from "../../secret";

export const COLORS = {
  tabBar: "#222326",
  tabSearch: "#FFFFFF",
  itemInactive: "#ADAEB3",
  itemActive: "#FFFFFF",
  background: "#121212",
  textLight: "#FFFFFF",
  textDim: "#B8B8B8",
};

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
export const LOGIN_URL = `${SPOTIFY_ACCOUNTS}/authorize?client_id=${
  secret.clientId
}&response_type=code&redirect_uri=${encodeURIComponent(
  SPOTIFY_REDIRECT_URI,
)}&scope=${encodeURIComponent(SCOPES)}`;
