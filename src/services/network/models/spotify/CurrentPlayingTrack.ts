import { Track } from "./SpotifyCommon"

export interface CurrentPlayingTrack {
  progress_ms: number
  is_playing: boolean
  item: Track
}
