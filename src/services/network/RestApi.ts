export interface SpotifyAPI {
  getMyProfile: () => any

  getAlbumById: (id: string) => any

  getMultipleAlbums: (ids: string) => any

  getAllFeaturedPlaylists: () => any

  getAllCategoriesForCountry: (country: string) => any

  getCategoryById: (id: string, urlQuery: string) => any

  getPlaylistById: (id: string) => any

  getCurrentUserSavedArtists: () => any

  getCurrentUserSavedTracks: () => any

  getCurrentUserSavedAlbums: () => any

  getCurrentUserTopArtists: () => any

  getRecentlyPlayedTracks: () => any

  getCurrentUserPlaylists: () => any

  getArtistById: (id: string) => any

  getRelatedArtistsById: (id: string) => any

  getArtistTopTracks: (id: string, country: string) => any

  search: (query: string) => any

  getPlayingTrack: () => any
}

class ApiEndpoints implements SpotifyAPI {
  private loginConfig = {
    clientId: "47417b69c3c0446e99d34e207a505b4e",
    responseType: "token",
    redirectURI: encodeURIComponent("http://localhost:8000"),
    scopes: encodeURIComponent(
      "user-read-private user-read-recently-played user-top-read playlist-read-private user-library-read user-follow-read user-modify-playback-state user-read-playback-state user-read-currently-playing",
    ),
    showDialog: "false",
  }
  private V1 = "v1"

  login = () =>
    `https://accounts.spotify.com/authorize?client_id=${this.loginConfig.clientId}&response_type=${this.loginConfig.responseType}&redirect_uri=${this.loginConfig.redirectURI}&scope=${this.loginConfig.scopes}&show_dialog=${this.loginConfig.showDialog}`

  getMyProfile = () => `${this.V1}/me`

  getAlbumById = (id: string) => `${this.V1}/albums/${id}`

  getMultipleAlbums = (ids: string) => `${this.V1}/albums?ids=${ids}`

  getAllFeaturedPlaylists = () => `${this.V1}/browse/featured-playlists?limit=8`

  getAllCategoriesForCountry = (country: string) =>
    `${this.V1}/browse/categories?country=${country}`

  getCategoryById = (id: string, urlQuery: string) =>
    `${this.V1}/browse/categories/${id}/playlists?${urlQuery}`

  getPlaylistById = (id: string) => `${this.V1}/playlists/${id}`

  getCurrentUserSavedArtists = () => `${this.V1}/me/following?type=artist`

  getCurrentUserSavedTracks = () => `${this.V1}/me/tracks?limit=50`

  getCurrentUserSavedAlbums = () => `${this.V1}/me/albums`

  getCurrentUserTopArtists = () => `${this.V1}/me/top/artists?limit=19`

  getRecentlyPlayedTracks = () =>
    `${this.V1}/me/player/recently-played?limit=20`

  getCurrentUserPlaylists = () => `${this.V1}/me/playlists`

  getArtistById = (id: string) => `${this.V1}/artists/${id}`

  getRelatedArtistsById = (id: string) =>
    `${this.V1}/artists/${id}/related-artists`

  getArtistTopTracks = (id: string, country: string) =>
    `${this.V1}/artists/${id}/top-tracks?market=${country}`

  search = (query: string) =>
    `${this.V1}/search?market=MY&type=album,artist,playlist,track&q=${query}`

  getPlayingTrack = () => `${this.V1}/me/player/currently-playing`
}

export default new ApiEndpoints()
