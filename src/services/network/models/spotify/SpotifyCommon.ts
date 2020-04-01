export interface ExternalUrls {
  spotify: string
}

export interface Image {
  height: number
  url: string
  width: number
}

export interface Followers {
  href?: any
  total: number
}

export interface SpotifyErrorResponse {
  error: { status: string; message: string }
}

interface ExternalIds {
  isrc: string
}

export interface Artist {
  external_urls: ExternalUrls
  followers: Followers
  genres: string[]
  href: string
  id: string
  images: Image[]
  name: string
  popularity: number
  type: string
  uri: string
}

interface Owner {
  display_name: string
  external_urls: ExternalUrls
  href: string
  id: string
  type: string
  uri: string
}

interface Copyright {
  text: string
  type: string
}

export interface Playlists {
  href: string
  items: PlaylistTrackObject[]
  limit: number
  next?: any
  offset: number
  previous?: any
  total: number
}

export interface Tracks {
  href: string
  items: Album[]
  limit: number
  next?: any
  offset: number
  previous?: any
  total: number
}

export interface Playlist {
  collaborative: boolean
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  owner: Owner
  primary_color?: any
  public?: any
  snapshot_id: string
  tracks: Playlists
  type: string
  uri: string
  description: string
  followers: Followers
}

export interface Album {
  artists: Artist[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  is_local: boolean
  owner: Owner
  preview_url: string
  track_number: number
  album_type: string
  external_urls: ExternalUrls
  href: string
  id: string
  images: Image[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
  copyrights: Copyright[]
  external_ids: ExternalIds
  genres: any[]
  label: string
  popularity: number
  tracks: Tracks
}

export interface Track {
  album: Album
  artists: Artist[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: ExternalIds
  external_urls: ExternalUrls
  href: string
  id: string
  is_local: boolean
  is_playable: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

interface Cursors {
  after: string
  before: string
}

export interface SpotifyPager<T> {
  items: T[]
  next: string
  cursors?: Cursors
  limit: number
  href: string
  offset: number
  previous: any
  total: number
}

export interface SavedAlbumObject {
  album: Album
}

export interface SavedTrackObject {
  track: Track
}

export interface PlaylistTrackObject {
  track: Track
}

export type AlbumType = {
  name: string
  imageURL: string | null
  id: string
  type?: "Album" | "Song" | "Artist" | "Playlist"
  artist?: string
  popularity?: number
}
