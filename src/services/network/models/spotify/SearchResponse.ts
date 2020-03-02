import { Album, Artist, Playlist, SpotifyPager, Track } from "./SpotifyCommon";

export interface SearchResponse {
  albums: SpotifyPager<Album>;
  artists: SpotifyPager<Artist>;
  tracks: SpotifyPager<Track>;
  playlists: SpotifyPager<Playlist>;
}
