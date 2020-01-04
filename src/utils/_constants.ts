// Route names
export const Routes = {
  LoginStack: { Login: "Login" },
  AppTabs: {
    HomeStack: {
      Home: "Home",
      PlaylistDetails: "PlaylistDetails",
      ArtistDetails: "ArtistDetails",
    },
    SearchStack: {
      Search: "Search",
      Genre: "Genre",
      PlaylistDetails: "PlaylistDetails",
    },
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

// API
export const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// Web view login redirect
const SPOTIFY_REDIRECT_URI = "http://localhost:8000";
// Login token scopes
const SCOPES =
  "user-read-private user-read-recently-played user-top-read playlist-read-private user-library-read user-follow-read";
// Query params:
// 1- client_id
// 2- response_type
// 3- redirect_uri
// 4- scope
const clientId = "47417b69c3c0446e99d34e207a505b4e";
const responseType = "token";
const showDialog = "false";

export const LOGIN_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(
  SPOTIFY_REDIRECT_URI,
)}&scope=${encodeURIComponent(SCOPES)}&show_dialog=${showDialog}`;
