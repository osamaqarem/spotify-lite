export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Followers {
  href?: any;
  total: number;
}

export interface ErrorResponse {
  error: { status: string; message: string };
}

export interface ExternalIds {
  isrc: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  images: Image[];
}

export interface Owner {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Copyright {
  text: string;
  type: string;
}

export interface Playlists {
  href: string;
  items: CommonPlaylistItem[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

export interface Tracks {
  href: string;
  items: AlbumItem[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

export interface CommonPlaylistItem {
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
  tracks: NonNullable<Followers>;
  type: string;
  uri: string;
}

export interface AlbumItem {
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

export type AlbumType = { name: string; url: string | null; id: string };
