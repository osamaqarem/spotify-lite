import { Artist, ExternalUrls, ExternalIds, Image } from "./SpotifyCommon";

export interface CurrentUserSavedTracks {
  href: string;
  items: CurrentUserSavedTracksItem[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}

export interface CurrentUserSavedTracksAlbum {
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

export interface CurrentUserSavedTracksTrack {
  album: CurrentUserSavedTracksAlbum;
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

export interface CurrentUserSavedTracksItem {
  added_at: Date;
  track: CurrentUserSavedTracksTrack;
}
