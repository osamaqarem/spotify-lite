import { ExternalUrls, Image, Owner } from "./SpotifyCommonTypes";

export interface FeaturedPlaylistsResponse {
  message: string;
  playlists: Playlists;
}

export interface FeaturedPlaylistsResponseTracks {
  href: string;
  total: number;
}

export interface FeaturedPlaylistsResponseItem {
  collaborative: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color?: any;
  public?: any;
  snapshot_id: string;
  tracks: FeaturedPlaylistsResponseTracks;
  type: string;
  uri: string;
}

export interface Playlists {
  href: string;
  items: FeaturedPlaylistsResponseItem[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}
