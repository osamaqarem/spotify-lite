export const loadingActions = {
  LOADING: "LOADING",
  DONE: "DONE",
};

// User profile API and auth API
export const userActions = {
  GET_TOKENS_SUCCESS: "GET_TOKENS_SUCCESS",
  GET_TOKENS_ERROR: "GET_TOKENS_ERROR",
  SET_TOKENS: "SET_TOKENS",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  ERROR: "ERROR",
  GET_PROFILE: "GET_PROFILE",
  PROFILE_SUCCESS: "PROFILE_SUCCESS",
};

export const playlistActions = {
  GET_PLAYLIST_COVER_BY_ID: "GET_PLAYLIST_COVER_BY_ID",
  GET_PLAYLIST_COVER_BY_ID_SUCCESS: "GET_PLAYLIST_COVER_BY_ID_SUCCESS",
  GET_PLAYLIST_COVER_BY_ID_ERROR: "GET_PLAYLIST_COVER_BY_ID_ERROR",
  GET_CURRENT_USER_PLAYLISTS: "GET_CURRENT_USER_PLAYLISTS",
  GET_CURRENT_USER_PLAYLISTS_SUCCESS: "GET_CURRENT_USER_PLAYLISTS_SUCCESS",
  GET_CURRENT_USER_PLAYLISTS_ERROR: "GET_CURRENT_USER_PLAYLISTS_ERROR",
};

export const albumActions = {
  GET_ALBUM: "GET_ALBUM",
  GET_ALBUM_SUCCESS: "GET_ALBUM_SUCCESS",
  GET_ALBUM_ERROR: "GET_ALBUM_ERROR",
  GET_MULTIPLE_ALBUM: "GET_MULTIPLE_ALBUM",
  GET_MULTIPLE_ALBUM_SUCCESS: "GET_MULTIPLE_ALBUM_SUCCESS",
  GET_MULTIPLE_ALBUM_ERROR: "GET_MULTIPLE_ALBUM_ERROR",
};

export const libraryActions = {
  GET_CURRENT_USER_SAVED_TRACKS: "GET_CURRENT_USER_SAVED_TRACKS",
  GET_CURRENT_USER_SAVED_TRACKS_SUCCESS:
    "GET_CURRENT_USER_SAVED_TRACKS_SUCCESS",
  GET_CURRENT_USER_SAVED_TRACKS_ERROR: "GET_CURRENT_USER_SAVED_TRACKS_ERROR",
  GET_CURRENT_USER_SAVED_ALBUMS: "GET_CURRENT_USER_SAVED_ALBUMS",
  GET_CURRENT_USER_SAVED_ALBUMS_SUCCESS:
    "GET_CURRENT_USER_SAVED_ALBUMS_SUCCESS",
  GET_CURRENT_USER_SAVED_ALBUMS_ERROR: "GET_CURRENT_USER_SAVED_ALBUMS_ERROR",
};

export const browseActions = {
  GET_ALL_FEATURED_PLAYLISTS: "GET_ALL_FEATURED_PLAYLISTS",
  GET_ALL_FEATURED_PLAYLISTS_SUCCESS: "GET_ALL_FEATURED_PLAYLISTS_SUCCESS",
  GET_ALL_FEATURED_PLAYLISTS_ERROR: "GET_ALL_FEATURED_PLAYLISTS_ERROR",
  GET_ALL_CATEGORIES_FOR_COUNTRY: "GET_ALL_CATEGORIES_FOR_COUNTRY",
  GET_ALL_CATEGORIES_FOR_COUNTRY_SUCCESS:
    "GET_ALL_CATEGORIES_FOR_COUNTRY_SUCCESS",
  GET_ALL_CATEGORIES_FOR_COUNTRY_ERROR: "GET_ALL_CATEGORIES_FOR_COUNTRY_ERROR",
};

export const personalizationActions = {
  GET_USER_TOP_ARTISTS: "GET_USER_TOP_ARTISTS",
  GET_USER_TOP_ARTISTS_SUCCESS: "GET_USER_TOP_ARTISTS_SUCCESS",
  GET_USER_TOP_ARTISTS_ERROR: "GET_USER_TOP_ARTISTS_ERROR",
};

export const followActions = {
  GET_CURRENT_USER_FOLLOWED_ARTISTS: "GET_CURRENT_USER_FOLLOWED_ARTISTS",
  GET_CURRENT_USER_FOLLOWED_ARTISTS_SUCCESS:
    "GET_CURRENT_USER_FOLLOWED_ARTISTS_SUCCESS",
  GET_CURRENT_USER_FOLLOWED_ARTISTS_ERROR:
    "GET_CURRENT_USER_FOLLOWED_ARTISTS_ERROR",
};

export const playerActions = {
  RECENTLY_PLAYED_TRACKS: "RECENTLY_PLAYED_TRACKS",
  RECENTLY_PLAYED_TRACKS_SUCCESS: "RECENTLY_PLAYED_TRACKS_SUCCESS",
  RECENTLY_PLAYED_TRACKS_ERROR: "RECENTLY_PLAYED_TRACKS_ERROR",
};
