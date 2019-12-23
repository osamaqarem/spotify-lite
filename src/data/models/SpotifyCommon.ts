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
