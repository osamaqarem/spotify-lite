export const loadingActions = {
  LOADING: "LOADING",
  DONE: "DONE",
};

export const authActions = {
  GET_TOKENS_SUCCESS: "GET_TOKENS_SUCCESS",
  GET_TOKENS_ERROR: "GET_TOKENS_ERROR",
  SET_TOKENS: "SET_TOKENS",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  ERROR: "ERROR",
  GET_PROFILE: "GET_PROFILE",
  PROFILE_SUCCESS: "PROFILE_SUCCESS",
};

export const playlistActions = {
  RECENTLY_PLAYED: "RECENTLY_PLAYED",
  RECENTLY_PLAYED_SUCCESS: "RECENTLY_PLAYED_SUCCESS",
  RECENTLY_PLAYED_ERROR: "RECENTLY_PLAYED_ERROR",
  GET_PLAYLIST_COVER_BY_ID: "GET_PLAYLIST_COVER_BY_ID",
  GET_PLAYLIST_COVER_BY_ID_SUCCESS: "GET_PLAYLIST_COVER_BY_ID_SUCCESS",
  GET_PLAYLIST_COVER_BY_ID_ERROR: "GET_PLAYLIST_COVER_BY_ID_ERROR",
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
  GET_ALL_FEATURED_PLAYLISTS: "GET_ALL_FEATURED_PLAYLISTS",
  GET_ALL_FEATURED_PLAYLISTS_SUCCESS: "GET_ALL_FEATURED_PLAYLISTS_SUCCESS",
  GET_ALL_FEATURED_PLAYLISTS_ERROR: "GET_ALL_FEATURED_PLAYLISTS_ERROR",
  GET_USER_TOP_ARTISTS: "GET_USER_TOP_ARTISTS",
  GET_USER_TOP_ARTISTS_SUCCESS: "GET_USER_TOP_ARTISTS_SUCCESS",
  GET_USER_TOP_ARTISTS_ERROR: "GET_USER_TOP_ARTISTS_ERROR",
};
