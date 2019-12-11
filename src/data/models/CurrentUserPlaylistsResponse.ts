import { ExternalUrls, Image, Owner } from "./SpotifyCommon";

export interface CurrentUserPlaylistsResponse {
  href: string;
  items: CurrentUserPlaylistsResponseItem[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

export interface CurrentUserPlaylistsResponseTracks {
  href: string;
  total: number;
}

export interface CurrentUserPlaylistsResponseItem {
  collaborative: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color?: any;
  public: boolean;
  snapshot_id: string;
  tracks: CurrentUserPlaylistsResponseTracks;
  type: string;
  uri: string;
}
