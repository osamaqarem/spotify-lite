const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const REDIRECT_URI = "http://localhost:8000";
const TOKEN_SCOPES =
  "user-read-private user-read-recently-played user-top-read playlist-read-private user-library-read user-follow-read";
// Query params:
const clientId = "47417b69c3c0446e99d34e207a505b4e";
const responseType = "token";
const redirectURI = encodeURIComponent(REDIRECT_URI);
const scopes = encodeURIComponent(TOKEN_SCOPES);
const showDialog = "false";

export const REST_API = {
  login: `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectURI}&scope=${scopes}&show_dialog=${showDialog}`,
  myProfile: `${SPOTIFY_API_BASE}/me`,
  getAlbumById: `${SPOTIFY_API_BASE}/albums/`,
  getMultipleAlbums: `${SPOTIFY_API_BASE}/albums?ids=`,
  getAllFeaturedPlaylists: `${SPOTIFY_API_BASE}/browse/featured-playlists?limit=8`,
  getAllCategoriesForCountry: (country: string) =>
    `${SPOTIFY_API_BASE}/browse/categories?country=${country}`,
  getCategoryById: (id: string, urlQueryString: string) =>
    `${SPOTIFY_API_BASE}/browse/categories/${id}/playlists?${urlQueryString}`,
  getPlaylistById: `${SPOTIFY_API_BASE}/playlists/`,
  getCurrentUserSavedArtists: `${SPOTIFY_API_BASE}/me/following?type=artist`,
  getCurrentUserSavedTracks: `${SPOTIFY_API_BASE}/me/tracks?limit=50`,
  getCurrentUserSavedAlbums: `${SPOTIFY_API_BASE}/me/albums`,
  getCurrentUserTopArtists: `${SPOTIFY_API_BASE}/me/top/artists?limit=19`,
  getRecentlyPlayedTracks: `${SPOTIFY_API_BASE}/me/player/recently-played?limit=20`,
  getCurrentUserPlaylists: `${SPOTIFY_API_BASE}/me/playlists`,
  getArtistById: (artistId: string) =>
    `${SPOTIFY_API_BASE}/artists/${artistId}`,
  getRelatedArtistsById: (artistId: string) =>
    `${SPOTIFY_API_BASE}/artists/${artistId}/related-artists`,
  getArtistTopTracks: (artistId: string, country: string) =>
    `${SPOTIFY_API_BASE}/artists/${artistId}/top-tracks?market=${country}`,
};
