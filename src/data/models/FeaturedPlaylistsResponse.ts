import { Playlists } from "./SpotifyCommon";

export interface FeaturedPlaylistsResponse {
  message: string;
  playlists: Playlists;
}

export interface FeaturedPlaylistsResponseTracks {
  href: string;
  total: number;
}
