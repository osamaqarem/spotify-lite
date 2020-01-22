import { ExternalUrls, Playlists, Owner, Image, Tracks } from "./SpotifyCommon";

type PlaylistTracks = Pick<Tracks, "href" | "total">;

export interface Item {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color?: any;
  public?: any;
  snapshot_id: string;
  tracks: PlaylistTracks;
  type: string;
  uri: string;
}

export interface GetCategoryResponse {
  playlists: Playlists;
}
