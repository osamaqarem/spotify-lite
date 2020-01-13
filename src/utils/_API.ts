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

export const API = {
  myProfile: `${SPOTIFY_API_BASE}/me`,
  getAlbumById: `${SPOTIFY_API_BASE}/albums/`,
  getMultipleAlbums: `${SPOTIFY_API_BASE}/albums?ids=`,
  getAllFeaturedPlaylists: `${SPOTIFY_API_BASE}/browse/featured-playlists?limit=8`,
  getAllCategoriesForCountry: `${SPOTIFY_API_BASE}/browse/categories?country=`,
  getCategoryById: (id: string, urlQueryString: string) =>
    `${SPOTIFY_API_BASE}/browse/categories/${id}/playlists?${urlQueryString}`,
  getPlaylistById: `${SPOTIFY_API_BASE}/playlists/`,
  getCurrentUserSavedArtists: `${SPOTIFY_API_BASE}/me/following?type=artist`,
  getCurrentUserSavedTracks: `${SPOTIFY_API_BASE}/me/tracks`,
  getCurrentUserSavedAlbums: `${SPOTIFY_API_BASE}/me/albums`,
  getCurrentUserTopArtists: `${SPOTIFY_API_BASE}/me/top/artists?limit=19`,
  getRecentlyPlayedTracks: `${SPOTIFY_API_BASE}/me/player/recently-played?limit=20`,
  getCurrentUserPlaylists: `${SPOTIFY_API_BASE}/me/playlists`,
};
