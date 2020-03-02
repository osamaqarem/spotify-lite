import { ExternalUrls, Image, Followers } from "./SpotifyCommon";

export interface ProfileResponse {
  country: string;
  display_name: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}
