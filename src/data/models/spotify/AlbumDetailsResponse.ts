import {
  Artist,
  ExternalUrls,
  Copyright,
  ExternalIds,
  Image,
  Tracks,
} from "./SpotifyCommon";

export interface AlbumDetailsResponse {
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
  tracks: Tracks;
  type: string;
  uri: string;
}
