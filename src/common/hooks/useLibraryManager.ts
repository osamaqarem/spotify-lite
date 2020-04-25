import { useDispatch } from "react-redux"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import { SpotifyErrorResponse } from "../../services/network/models/spotify/SpotifyCommon"
import { redoLogin } from "../../redux/slices"

export type ItemType = "ALBUM" | "PLAYLIST" | "ARTIST" | "TRACK" | "USER"

export const SpotifyLibraryManager = () => {
  const dispatch = useDispatch()

  const handleError = (e: any) => {
    if (SpotifyApiService.sessionIsExpired(e)) {
      dispatch(redoLogin())
    } else {
      console.warn(e)
    }
  }
  const saveTracks = async (formattedIds: string) => {
    try {
      const res = await SpotifyApiService.saveTracks(formattedIds)
      if (!res.ok) {
        const err: SpotifyErrorResponse = await res.json()
        throw err
      }
      return true
    } catch (e) {
      handleError(e)
    }
  }

  const removeTracks = async (formattedIds: string) => {
    try {
      const res = await SpotifyApiService.removeTracks(formattedIds)
      if (!res.ok) {
        const err: SpotifyErrorResponse = await res.json()
        throw err
      }
      return true
    } catch (e) {
      handleError(e)
    }
  }

  const getSavedStateForTracks = async (formattedIds: string) => {
    try {
      const [isSaved] = await SpotifyApiService.getSavedStateForTracks(
        formattedIds,
      )
      return isSaved
    } catch (e) {
      handleError(e)
    }
  }

  const saveAlbums = async (formattedIds: string) => {
    try {
      const res = await SpotifyApiService.saveAlbums(formattedIds)
      if (!res.ok) {
        const err: SpotifyErrorResponse = await res.json()
        throw err
      }
      return true
    } catch (e) {
      handleError(e)
    }
  }

  const removeAlbums = async (formattedIds: string) => {
    try {
      const res = await SpotifyApiService.removeAlbums(formattedIds)
      if (!res.ok) {
        const err: SpotifyErrorResponse = await res.json()
        throw err
      }
      return true
    } catch (e) {
      handleError(e)
    }
  }

  const getSavedStateForAlbums = async (formattedIds: string) => {
    try {
      const [isSaved] = await SpotifyApiService.getSavedStateForAlbums(
        formattedIds,
      )
      return isSaved
    } catch (e) {
      handleError(e)
    }
  }

  const followArtistsOrUsers = async (
    formattedIds: string,
    type: "artist" | "user",
  ) => {
    try {
      const res = await SpotifyApiService.followArtistsOrUsers(
        formattedIds,
        type,
      )
      if (!res.ok) {
        const err: SpotifyErrorResponse = await res.json()
        throw err
      }
      return true
    } catch (e) {
      handleError(e)
    }
  }

  const unfollowArtistsOrUsers = async (formattedIds: string, type: 'artist' | 'user') => {
    try {
      const res = await SpotifyApiService.unfollowArtistsOrUsers(formattedIds, type)
      if (!res.ok) {
        const err: SpotifyErrorResponse = await res.json()
        throw err
      }
      return true
    } catch (e) {
      handleError(e)
    }
  }

  const getFollowingStateForArtistsOrUsers = async (
    formattedIds: string,
    type: "artist" | "user",
  ) => {
    try {
      const [
        isSaved,
      ] = await SpotifyApiService.getFollowingStateForArtistsOrUsers(
        formattedIds,
        type,
      )
      return isSaved
    } catch (e) {
      handleError(e)
    }
  }

  const followPlaylist = async (id: string) => {
    try {
      const res = await SpotifyApiService.followPlaylist(id)
      if (!res.ok) {
        const err: SpotifyErrorResponse = await res.json()
        throw err
      }
      return true
    } catch (e) {
      handleError(e)
    }
  }

  const unfollowPlaylist = async (id: string) => {
    try {
      const res = await SpotifyApiService.unfollowPlaylist(id)
      if (!res.ok) {
        const err: SpotifyErrorResponse = await res.json()
        throw err
      }
      return true
    } catch (e) {
      handleError(e)
    }
  }

  const getFollowingStateForPlaylist = async (id: string, userId: string) => {
    try {
      const [isSaved] = await SpotifyApiService.getFollowingStateForPlaylist(
        id,
        userId,
      )
      return isSaved
    } catch (e) {
      handleError(e)
    }
  }

  const saveItem = (formattedIds: string, type: ItemType) => {
    switch (type) {
      case "ALBUM":
        return saveAlbums(formattedIds)
      case "ARTIST":
        return followArtistsOrUsers(formattedIds, "artist")
      case "USER":
        return followArtistsOrUsers(formattedIds, "user")
      case "PLAYLIST":
        return followPlaylist(formattedIds)
      case "TRACK":
        return saveTracks(formattedIds)
      default:
        throw new Error("Library Manager: Unexpected item type.")
    }
  }

  const removeItem = (formattedIds: string, type: ItemType) => {
    switch (type) {
      case "ALBUM":
        return removeAlbums(formattedIds)
      case "ARTIST":
        return unfollowArtistsOrUsers(formattedIds, 'artist')
      case "USER":
        return unfollowArtistsOrUsers(formattedIds, 'user')
      case "PLAYLIST":
        return unfollowPlaylist(formattedIds)
      case "TRACK":
        return removeTracks(formattedIds)
      default:
        throw new Error("Library Manager: Unexpected item type.")
    }
  }

  const getItemSavedOrFollowedState = (
    formattedIds: string,
    type: ItemType,
    userId?: string,
  ) => {
    switch (type) {
      case "ALBUM":
        return getSavedStateForAlbums(formattedIds)
      case "ARTIST":
        return getFollowingStateForArtistsOrUsers(formattedIds, "artist")
      case "USER":
        return getFollowingStateForArtistsOrUsers(formattedIds, "user")
      case "PLAYLIST":
        if (typeof userId === "string") {
          return getFollowingStateForPlaylist(formattedIds, userId)
        } else {
          throw new Error(
            "getItemSavedOrFollowedState: User ID is not a string",
          )
        }
      case "TRACK":
        return getSavedStateForTracks(formattedIds)
      default:
        throw new Error("Library Manager: Unexpected item type.")
    }
  }

  return {
    saveItem,
    removeItem,
    getItemSavedOrFollowedState,
  }
}
