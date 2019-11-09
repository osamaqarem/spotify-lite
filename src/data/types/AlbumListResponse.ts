import {
  ExternalUrls,
  Image,
  ExternalIds,
  Artist,
  Copyright,
} from "./SpotifyCommonTypes";

export interface AlbumListResponse {
  albums: AlbumListResponseAlbum[];
}

export interface AlbumListResponseItem {
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface AlbumListResponseTracks {
  href: string;
  items: AlbumListResponseItem[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

export interface AlbumListResponseAlbum {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  copyrights: Copyright[];
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  genres: any[];
  href: string;
  id: string;
  images: Image[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  tracks: AlbumListResponseTracks;
  type: string;
  uri: string;
}
