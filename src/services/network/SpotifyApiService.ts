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
  verb?: "GET" | "PUT" | "POST" | "DELETE"
  timeoutInSeconds?: number
}

class SpotifyApiService implements SpotifyAPI {
  private defaultTimeout = 30
  private BASE_URL = "https://api.spotify.com/"

  private getHttpConfig = (token: string, verb: ApiConfig["verb"] = "GET") => ({
    method: verb,
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

  private api = async <T>({ url, verb, timeoutInSeconds }: ApiConfig) => {
    if (NetworkHelper.isInternetReachable) {
      const token = await SpotifyAsyncStoreService.getToken()
      const reqConfig = await this.getHttpConfig(token!, verb)

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

  checkSavedTracks = (ids: string) =>
    this.api<boolean[]>({
      url: SpotifyEndpoints.checkSavedTracks(ids),
    })

  getCurrentUserSavedAlbums = () =>
    from(
      this.api<SpotifyPager<SavedAlbumObject>>({
        url: SpotifyEndpoints.getCurrentUserSavedAlbums(),
      }),
    )
  checkSavedAlbums = (ids: string) =>
    this.api<boolean[]>({
      url: SpotifyEndpoints.checkSavedAlbums(ids),
    })
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

  saveAlbums = (ids: string) =>
    this.api<Response>({
      url: SpotifyEndpoints.saveAlbums(ids),
      verb: "PUT",
    })

  saveTracks = (ids: string) =>
    this.api<Response>({
      url: SpotifyEndpoints.saveTracks(ids),
      verb: "PUT",
    })

  removeAlbums = (ids: string) =>
    this.api<Response>({
      url: SpotifyEndpoints.removeAlbums(ids),
      verb: "DELETE",
    })

  removeTracks = (ids: string) =>
    this.api<Response>({
      url: SpotifyEndpoints.removeTracks(ids),
      verb: "DELETE",
    })

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
}

export default new SpotifyApiService()
