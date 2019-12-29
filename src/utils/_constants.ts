// Route names
export const Routes = {
  LoginStack: { Login: "Login" },
  AppTabs: {
    HomeStack: {
      Home: "Home",
      PlaylistDetails: "PlaylistDetails",
      ArtistDetails: "ArtistDetails",
    },
    SearchStack: "Search",
    FavoritesTabs: {
      FavoritePlaylistsStack: {
        FavoritePlaylists: "FavoritePlaylists",
        PlaylistDetails: "PlaylistDetails",
      },
      FavoriteArtistsStack: {
        FavoriteArtists: "FavoriteArtists",
        ArtistDetails: "ArtistDetails",
      },
      FavoriteAlbumsStack: {
        FavoriteAlbums: "FavoriteAlbums",
        PlaylistDetails: "PlaylistDetails",
      },
    },
  },
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
const clientId = "47417b69c3c0446e99d34e207a505b4e";
const responseType = "token";
const showDialog = "false";

export const LOGIN_URL = `${SPOTIFY_ACCOUNTS}/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(
  SPOTIFY_REDIRECT_URI,
)}&scope=${encodeURIComponent(SCOPES)}&show_dialog=${showDialog}`;
