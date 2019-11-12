import { Followers, ExternalUrls, Image } from "./SpotifyCommonTypes";

export interface CurrentUserSavedArtistsResponse {
  artists: Artists;
}

export interface CurrentUserSavedArtistsResponseItem {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface CurrentUserSavedArtistsResponseCursors {
  after?: any;
}

export interface Artists {
  items: CurrentUserSavedArtistsResponseItem[];
  next?: any;
  total: number;
  cursors: CurrentUserSavedArtistsResponseCursors;
  limit: number;
  href: string;
}
