import { from } from "rxjs"
import NetworkHelper from "../../common/helpers/NetworkHelper"
import SpotifyAsyncStoreService from "../asyncstorage/SpotifyAsyncStoreService"
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
import SpotifyEndpoints, { SpotifyAPI } from "./SpotifyEndpoints"
import { CurrentPlayingTrack } from "./models/spotify/CurrentPlayingTrack"

type ContentType = "JSON" | "Text" | "Unsupported"
interface ApiConfig {
  url: RequestInfo
  verb?: "GET" | "PUT" | "POST"
  timeoutInSeconds?: number
}

class SpotifyApiService implements SpotifyAPI {
  private defaultTimeout = 30
  private BASE_URL = "https://api.spotify.com/"
  private httpGetConfig = (token: string) => ({
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  })

  private httpPutConfig = (token: string) => ({
    method: "PUT",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  })

  private httpPostConfig = (token: string) => ({
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  })

  private getContentType = (res: Response): ContentType => {
    const isJSON =
      res.headers.get("Content-Type")?.startsWith("application/json") || false

    if (isJSON) return "JSON"

    const isText = res.headers.get("Content-Type")?.startsWith("text") || false

    if (isText) return "Text"

    return "Unsupported"
  }

  private doThrow = async (res: Response, contentType: ContentType) => {
    // Not 2XX
    if (contentType === "JSON") {
      const { error }: SpotifyErrorResponse = await res.json()
      throw new SpotifyHttpException(error.status, error.message, res.url)
    } else if (contentType === "Text") {
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

  private processResponse = async (res: Response) => {
    const contentType = this.getContentType(res)

    // HTTP 2XX
    if (res.ok) {
      if (contentType === "JSON") {
        return await res.json()
      } else {
        return res
      }
    }

    return this.doThrow(res, contentType)
  }

  private getConfigForVerb = async (verb: ApiConfig["verb"]) => {
    const token = await SpotifyAsyncStoreService.getToken()
    switch (verb) {
      case "GET":
        return this.httpGetConfig(token!)
      case "PUT":
        return this.httpPutConfig(token!)
      case "POST":
        return this.httpPostConfig(token!)
      default:
        throw new SpotifyHttpException(
          "Error",
          "Invalid HTTP verb. Did you update getConfigForVerb?",
          verb!,
        )
    }
  }

  private api = async <T>({
    url,
    verb = "GET",
    timeoutInSeconds,
  }: ApiConfig) => {
    if (NetworkHelper.isInternetReachable) {
      const reqConfig = await this.getConfigForVerb(verb)
      const fullURL = this.BASE_URL + url
      const reqTimeout = timeoutInSeconds || this.defaultTimeout

      const contoller = new AbortController()
      const finalConfig = { signal: contoller.signal, ...reqConfig }

      const abort = setTimeout(() => {
        contoller.abort()
      }, reqTimeout * 1000)

      const res = await fetch(fullURL, finalConfig)

      clearTimeout(abort)

      return this.processResponse(res) as Promise<T>
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
      this.api<ProfileResponse>({ url: SpotifyEndpoints.getMyProfile() }),
    )

  getAlbumById = (id: string) =>
    from(
      this.api<Album>({ url: SpotifyEndpoints.getAlbumById(id) }),
    )

  getMultipleAlbums = (ids: string) =>
    from(
      this.api<{ albums: Album[] }>({
        url: SpotifyEndpoints.getMultipleAlbums(ids),
      }),
    )

  getAllFeaturedPlaylists = () =>
    from(
      this.api<{ playlists: SpotifyPager<Playlist> }>({
        url: SpotifyEndpoints.getAllFeaturedPlaylists(),
      }),
    )

  getAllCategoriesForCountry = (country: string) =>
    from(
      this.api<AllCategoriesResponse>({
        url: SpotifyEndpoints.getAllCategoriesForCountry(country),
      }),
    )

  getCategoryById = (id: string, urlQueryString: string) =>
    from(
      this.api<{ playlists: SpotifyPager<Category> }>({
        url: SpotifyEndpoints.getCategoryById(id, urlQueryString),
      }),
    )

  getPlaylistById = (id: string) =>
    from(
      this.api<Playlist>({ url: SpotifyEndpoints.getPlaylistById(id) }),
    )

  getCurrentUserSavedArtists = () =>
    from(
      this.api<{ artists: SpotifyPager<Artist> }>({
        url: SpotifyEndpoints.getCurrentUserSavedArtists(),
      }),
    )

  getCurrentUserSavedTracks = () =>
    from(
      this.api<SpotifyPager<PlaylistTrackObject>>({
        url: SpotifyEndpoints.getCurrentUserSavedTracks(),
      }),
    )

  getCurrentUserSavedAlbums = () =>
    from(
      this.api<SpotifyPager<SavedAlbumObject>>({
        url: SpotifyEndpoints.getCurrentUserSavedAlbums(),
      }),
    )

  getCurrentUserTopArtists = () =>
    from(
      this.api<SpotifyPager<Artist>>({
        url: SpotifyEndpoints.getCurrentUserTopArtists(),
      }),
    )

  getRecentlyPlayedTracks = () =>
    from(
      this.api<SpotifyPager<SavedTrackObject>>({
        url: SpotifyEndpoints.getRecentlyPlayedTracks(),
      }),
    )

  getCurrentUserPlaylists = () =>
    from(
      this.api<Tracks>({ url: SpotifyEndpoints.getCurrentUserPlaylists() }),
    )

  getArtistById = (id: string) =>
    from(
      this.api<Artist>({ url: SpotifyEndpoints.getArtistById(id) }),
    )

  getRelatedArtistsById = (id: string) =>
    from(
      this.api<{ artists: Artist[] }>({
        url: SpotifyEndpoints.getRelatedArtistsById(id),
      }),
    )

  getArtistTopTracks = (id: string, country: string) =>
    from(
      this.api<{ tracks: Track[] }>({
        url: SpotifyEndpoints.getArtistTopTracks(id, country),
      }),
    )

  search = (query: string) =>
    from(
      this.api<SearchResponse>({ url: SpotifyEndpoints.search(`"${query}"`) }),
    )

  getPlayingTrack = () =>
    this.api<CurrentPlayingTrack | Response>({
      url: SpotifyEndpoints.getPlayingTrack(),
    })

  resumePlayback = () =>
    this.api<Response>({
      url: SpotifyEndpoints.resumePlayback(),
      verb: "PUT",
    })

  pausePlayback = () =>
    this.api<Response>({
      url: SpotifyEndpoints.pausePlayback(),
      verb: "PUT",
    })

  nextTrack = () =>
    this.api<Response>({
      url: SpotifyEndpoints.nextTrack(),
      verb: "POST",
    })
}

export default new SpotifyApiService()
