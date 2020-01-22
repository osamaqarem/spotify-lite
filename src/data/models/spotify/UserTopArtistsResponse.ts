import { ExternalUrls, Followers, Image } from "./SpotifyCommon";

export interface UserTopArtistsResponse {
  items: UserTopArtistsResponseItem[];
  total: number;
  limit: number;
  offset: number;
  previous?: any;
  href: string;
  next: string;
}
export interface UserTopArtistsResponseItem {
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
