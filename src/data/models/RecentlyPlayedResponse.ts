import { ExternalUrls, Image, ExternalIds, Artist } from "./SpotifyCommon";

export interface RecentlyPlayedResponse {
  items: RecentlyPlayedResponseItem[];
  next: string;
  cursors: RecentlyPlayedResponseCursors;
  limit: number;
  href: string;
}

export interface RecentlyPlayedResponseAlbum {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface RecentlyPlayedResponseTrack {
  album: RecentlyPlayedResponseAlbum;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface Context {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface RecentlyPlayedResponseItem {
  track: RecentlyPlayedResponseTrack;
  played_at: Date;
  context: Context;
}

export interface RecentlyPlayedResponseCursors {
  after: string;
  before: string;
}
