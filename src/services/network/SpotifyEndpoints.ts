export interface SpotifyAPI {
  getMyProfile: () => any

  getCurrentUserSavedArtists: () => any

  getCurrentUserSavedTracks: () => any

  getSavedStateForTracks: (ids: string) => any

  getCurrentUserSavedAlbums: () => any

  getSavedStateForAlbums: (ids: string) => any

  getFollowingStateForArtistsOrUsers: (
    ids: string,
    type: "artist" | "user",
  ) => any

  getFollowingStateForPlaylist: (ids: string, userId: string) => any

  getCurrentUserTopArtists: () => any

  getRecentlyPlayedTracks: () => any

  getCurrentUserPlaylists: () => any

  getAlbum: (id: string) => any

  getMultipleAlbums: (ids: string) => any

  getAllFeaturedPlaylists: () => any

  getAllCategoriesForCountry: (country: string) => any

  getCategory: (id: string, urlQuery: string) => any

  getPlaylist: (id: string) => any

  getArtist: (id: string) => any

  getRelatedArtists: (id: string) => any

  getArtistTopTracks: (id: string, country: string) => any

  search: (query: string) => any

  getPlayingTrack: () => any

  resumePlayback: () => any

  pausePlayback: () => any

  nextTrack: () => any

  saveTracks: (ids: string) => any

  saveAlbums: (ids: string) => any

  removeTracks: (ids: string) => any

  removeAlbums: (ids: string) => any

  followPlaylist: (ids: string) => any

  unfollowPlaylist: (ids: string) => any

  followArtistsOrUsers: (ids: string, type: "artist" | "user") => any

  unfollowArtistsOrUsers: (ids: string, type: "artist" | "user") => any
}

class SpotifyEndpoints implements SpotifyAPI {
  private loginConfig = {
    clientId: "47417b69c3c0446e99d34e207a505b4e",
    responseType: "token",
    redirectURI: encodeURIComponent("http://localhost:8000"),
    scopes: encodeURIComponent(
      "user-read-private user-read-recently-played user-top-read playlist-read-private user-library-read user-follow-read user-modify-playback-state user-read-playback-state user-read-currently-playing user-library-modify user-follow-modify playlist-modify-public playlist-modify-private",
    ),
    showDialog: "false",
  }
  private V1 = "v1"

  login = () =>
    `https://accounts.spotify.com/authorize?client_id=${this.loginConfig.clientId}&response_type=${this.loginConfig.responseType}&redirect_uri=${this.loginConfig.redirectURI}&scope=${this.loginConfig.scopes}&show_dialog=${this.loginConfig.showDialog}`

  getMyProfile = () => `${this.V1}/me`

  getCurrentUserSavedArtists = () => `${this.V1}/me/following?type=artist`

  getCurrentUserSavedTracks = () => `${this.V1}/me/tracks?limit=50`

  getCurrentUserSavedAlbums = () => `${this.V1}/me/albums`

  getCurrentUserTopArtists = () => `${this.V1}/me/top/artists?limit=19`

  getRecentlyPlayedTracks = () =>
    `${this.V1}/me/player/recently-played?limit=20`

  getCurrentUserPlaylists = () => `${this.V1}/me/playlists`

  getPlayingTrack = () => `${this.V1}/me/player/currently-playing`

  resumePlayback = () => `${this.V1}/me/player/play`

  pausePlayback = () => `${this.V1}/me/player/pause`

  nextTrack = () => `${this.V1}/me/player/next`

  getSavedStateForAlbums = (ids: string) =>
    `${this.V1}/me/albums/contains?ids=${ids}`

  getFollowingStateForArtistsOrUsers = (ids: string, type: "artist" | "user") =>
    `${this.V1}/me/following/contains?type=${type}&ids=${ids}`

  getFollowingStateForPlaylist = (id: string, userId: string) =>
    `${this.V1}/playlists/${id}/followers/contains?ids=${userId}`

  getSavedStateForTracks = (ids: string) =>
    `${this.V1}/me/tracks/contains?ids=${ids}`

  saveAlbums = (ids: string) => `${this.V1}/me/albums?ids=${ids}`

  followArtistsOrUsers = (ids: string, type: "artist" | "user") =>
    `${this.V1}/me/following?type=${type}&ids=${ids}`

  followPlaylist = (id: string) => `${this.V1}/playlists/${id}/followers`

  saveTracks = (ids: string) => `${this.V1}/me/tracks?ids=${ids}`

  unfollowArtistsOrUsers = (ids: string, type: "artist" | "user") => `${this.V1}/me/following?type=${type}&ids=${ids}`

  removeAlbums = (ids: string) => `${this.V1}/me/albums?ids=${ids}`

  removeTracks = (ids: string) => `${this.V1}/me/tracks?ids=${ids}`

  unfollowPlaylist = (id: string) => `${this.V1}/playlists/${id}/followers`

  getAlbum = (id: string) => `${this.V1}/albums/${id}`

  getMultipleAlbums = (ids: string) => `${this.V1}/albums?ids=${ids}`

  getAllFeaturedPlaylists = () => `${this.V1}/browse/featured-playlists?limit=8`

  getAllCategoriesForCountry = (country: string) =>
    `${this.V1}/browse/categories?country=${country}`

  getCategory = (id: string, urlQuery: string) =>
    `${this.V1}/browse/categories/${id}/playlists?${urlQuery}`

  getPlaylist = (id: string) => `${this.V1}/playlists/${id}`

  getArtist = (id: string) => `${this.V1}/artists/${id}`

  getRelatedArtists = (id: string) => `${this.V1}/artists/${id}/related-artists`

  getArtistTopTracks = (id: string, country: string) =>
    `${this.V1}/artists/${id}/top-tracks?market=${country}`

  search = (query: string) =>
    `${this.V1}/search?market=MY&type=album,artist,playlist,track&q=${query}`
}

export default new SpotifyEndpoints()
