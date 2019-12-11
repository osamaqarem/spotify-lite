import {
  ExternalUrls,
  Image,
  ExternalIds,
  Followers,
  Artist,
  Owner,
} from "./SpotifyCommon";

export interface PlaylistResponse {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color?: any;
  public: boolean;
  snapshot_id: string;
  tracks: PlaylistResponseTracks;
  type: string;
  uri: string;
}

export interface AddedBy {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface PlaylistResponseAlbum {
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

export interface PlaylistResponseTrack {
  album: PlaylistResponseAlbum;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

export interface VideoThumbnail {
  url?: any;
}

export interface PlaylistItem {
  added_at: Date;
  added_by: AddedBy;
  is_local: boolean;
  primary_color?: any;
  track: PlaylistResponseTrack;
  video_thumbnail: VideoThumbnail;
}

export interface PlaylistResponseTracks {
  href: string;
  items: PlaylistItem[];
  limit: number;
  next: string;
  offset: number;
  previous?: any;
  total: number;
}
