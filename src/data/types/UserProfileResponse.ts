import { ExternalUrls, Image, Followers } from "./SpotifyCommonTypes";

export interface UserProfileResponse {
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

export interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}
