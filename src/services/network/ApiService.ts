import { from } from "rxjs"
import NetworkHelper from "../../common/helpers/NetworkHelper"
import AsyncStore from "../asyncstorage/AsyncStore"
import OfflineException from "./exceptions/OfflineException"
import SpotifyHttpException from "./exceptions/SpotifyHttpException"
import {
  AllCategoriesResponse,
  Category,
} from "./models/spotify/AllCategoriesResponse"
import { ProfileResponse } from "./models/spotify/ProfileResponse"
import { SearchResponse } from "./models/spotify/SearchResponse"
import {
  Album,
  Artist,
  Playlist,
  PlaylistTrackObject,
  SavedAlbumObject,
  SavedTrackObject,
  SpotifyErrorResponse,
  SpotifyPager,
  Track,
  Tracks,
} from "./models/spotify/SpotifyCommon"
import ApiEndpoints, { SpotifyAPI } from "./RestApi"
import { CurrentPlayingTrack } from "./models/spotify/CurrentPlayingTrack"

class ApiClient implements SpotifyAPI {
  private defaultTimeout = 30
  private BASE_URL = "https://api.spotify.com/"
  private getDefaultConfig = (token: string) => ({
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  })

  private responseOkOrThrow = async <T>(res: Response) => {
    const isJSON = res.headers
      .get("Content-Type")
      ?.startsWith("application/json")

    const isText = res.headers.get("Content-Type")?.startsWith("text")

    if (res.ok && isJSON) {
      // HTTP 2XX
      return (await res.json()) as Promise<T>
    } else {
      // Not 2XX
      if (isJSON) {
        const { error }: SpotifyErrorResponse = await res.json()
        throw new SpotifyHttpException(error.status, error.message, res.url)
      } else if (isText) {
        const errorText = await res.text()
        throw new SpotifyHttpException(res.status, errorText, res.url)
      }

      // Not 2XX, not JSON and not text.
      throw new SpotifyHttpException(
        res.status,
        "Unsupported content type",
        res.url,
      )
    }
  }

  private api = async <T>({
    url,
    config,
    timeoutInSeconds,
  }: {
    url: RequestInfo
    config?: RequestInit
    timeoutInSeconds?: number
  }) => {
    if (NetworkHelper.isInternetReachable) {
      const token = await AsyncStore.getToken()
      const fullURL = this.BASE_URL + url
      const reqConfig = config || this.getDefaultConfig(token!)
      const reqTimeout = timeoutInSeconds || this.defaultTimeout

      const contoller = new AbortController()
      const finalConfig = { signal: contoller.signal, ...reqConfig }

      const abort = setTimeout(() => {
        contoller.abort()
      }, reqTimeout * 1000)

      const result = await fetch(fullURL, finalConfig)

      clearTimeout(abort)
      return this.responseOkOrThrow<T>(result)
    } else {
      throw new OfflineException(
        "Offline",
        "Internet not reachable",
        url.toString(),
      )
    }
  }

  sessionIsExpired = (err: any) => {
    if (err instanceof SpotifyHttpException && err.status == 401) {
      if (
        err.message === "Invalid access token" ||
        err.message.includes("expired")
      ) {
        return true
      }
    }
  }

  getMyProfile = () =>
    from(
      this.api<ProfileResponse>({ url: ApiEndpoints.getMyProfile() }),
    )

  getAlbumById = (id: string) =>
    from(
      this.api<Album>({ url: ApiEndpoints.getAlbumById(id) }),
    )

  getMultipleAlbums = (ids: string) =>
    from(
      this.api<{ albums: Album[] }>({
        url: ApiEndpoints.getMultipleAlbums(ids),
      }),
    )

  getAllFeaturedPlaylists = () =>
    from(
      this.api<{ playlists: SpotifyPager<Playlist> }>({
        url: ApiEndpoints.getAllFeaturedPlaylists(),
      }),
    )

  getAllCategoriesForCountry = (country: string) =>
    from(
      this.api<AllCategoriesResponse>({
        url: ApiEndpoints.getAllCategoriesForCountry(country),
      }),
    )

  getCategoryById = (id: string, urlQueryString: string) =>
    from(
      this.api<{ playlists: SpotifyPager<Category> }>({
        url: ApiEndpoints.getCategoryById(id, urlQueryString),
      }),
    )

  getPlaylistById = (id: string) =>
    from(
      this.api<Playlist>({ url: ApiEndpoints.getPlaylistById(id) }),
    )

  getCurrentUserSavedArtists = () =>
    from(
      this.api<{ artists: SpotifyPager<Artist> }>({
        url: ApiEndpoints.getCurrentUserSavedArtists(),
      }),
    )

  getCurrentUserSavedTracks = () =>
    from(
      this.api<SpotifyPager<PlaylistTrackObject>>({
        url: ApiEndpoints.getCurrentUserSavedTracks(),
      }),
    )

  getCurrentUserSavedAlbums = () =>
    from(
      this.api<SpotifyPager<SavedAlbumObject>>({
        url: ApiEndpoints.getCurrentUserSavedAlbums(),
      }),
    )

  getCurrentUserTopArtists = () =>
    from(
      this.api<SpotifyPager<Artist>>({
        url: ApiEndpoints.getCurrentUserTopArtists(),
      }),
    )

  getRecentlyPlayedTracks = () =>
    from(
      this.api<SpotifyPager<SavedTrackObject>>({
        url: ApiEndpoints.getRecentlyPlayedTracks(),
      }),
    )

  getCurrentUserPlaylists = () =>
    from(
      this.api<Tracks>({ url: ApiEndpoints.getCurrentUserPlaylists() }),
    )

  getArtistById = (id: string) =>
    from(
      this.api<Artist>({ url: ApiEndpoints.getArtistById(id) }),
    )

  getRelatedArtistsById = (id: string) =>
    from(
      this.api<{ artists: Artist[] }>({
        url: ApiEndpoints.getRelatedArtistsById(id),
      }),
    )

  getArtistTopTracks = (id: string, country: string) =>
    from(
      this.api<{ tracks: Track[] }>({
        url: ApiEndpoints.getArtistTopTracks(id, country),
      }),
    )

  search = (query: string) =>
    from(
      this.api<SearchResponse>({ url: ApiEndpoints.search(`"${query}"`) }),
    )

  getPlayingTrack = () =>
    this.api<CurrentPlayingTrack>({
      url: ApiEndpoints.getPlayingTrack(),
    })
}

export default new ApiClient()
