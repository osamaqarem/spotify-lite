import {
  ExternalUrls,
  Artist,
  ExternalIds,
  Image,
  Copyright,
} from "./SpotifyCommonTypes";

export interface CurrentUserSavedAlbums {
  href: string;
  items: CurrentUserSavedAlbumsItem[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

export interface CurrentUserSavedAlbumsItem2 {
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

export interface CurrentUserSavedAlbumsTracks {
  href: string;
  items: CurrentUserSavedAlbumsItem2[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

export interface Album {
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
  tracks: CurrentUserSavedAlbumsTracks;
  type: string;
  uri: string;
}

export interface CurrentUserSavedAlbumsItem {
  added_at: Date;
  album: Album;
}
