export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  error: string | null;
  error_description: string | null;
}

export interface ProfileResponse {
  display_name: string;
  email: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height?: any;
  url: string;
  width?: any;
}

export interface ProfileError {
  error: { status: string; message: string };
}
