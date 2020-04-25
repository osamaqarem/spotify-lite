import { createSlice } from "@reduxjs/toolkit"
import { ofType } from "redux-observable"
import { Observable, of } from "rxjs"
import { catchError, map, switchMap } from "rxjs/operators"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import { Action } from "../rootReducer"
import { pushActionToRestart } from "./globalSlice"
import { redoLogin } from "./userSlice"

export type TrackType = { name: string; artistName: string }

export type PlaylistDetailsType = {
  name: string
  ownerName: string | null
  imageUrl: string
  tracks: TrackType[]
  followerCount?: number
  id: string | null
  type: "ALBUM" | "PLAYLIST"
}

export type SavedPlaylistsType = {
  name: string
  url: string | null
  owner: string
  id: string
}

type PlaylistReducerType = {
  playlistDetails: PlaylistDetailsType | null
  currentUserPlaylists: SavedPlaylistsType[]
}

const initialState: PlaylistReducerType = {
  playlistDetails: null,
  currentUserPlaylists: [],
}

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    getPlaylistById: (state, _) => state,
    getPlaylistByIdError: (state) => state,
    getPlaylistByIdSuccess: (state, action) => ({
      ...state,
      playlistDetails: action.payload,
    }),
    getCurrentUserPlaylists: (state) => state,
    getCurrentUserPlaylistsError: (state) => state,
    getCurrentUserPlaylistsSuccess: (state, action) => ({
      ...state,
      currentUserPlaylists: action.payload,
    }),
    clearCurrentPlaylist: (state) => ({ ...state, playlistDetails: null }),
  },
})

const getPlayListByIdEpic = (actions$: Observable<Action<string>>) =>
  actions$.pipe(
    ofType(getPlaylistById.type),
    switchMap(({ payload: playListId }: Action<string>) =>
      SpotifyApiService.getPlaylist(playListId!).pipe(
        map((res) => {
          const tracks: TrackType[] = res.tracks.items.map((item) => ({
            artistName:
              item.track?.artists[0].name ?? "No track returned by spotify :(",
            name: item.track?.name ?? "No track",
          }))

          const playlist: PlaylistDetailsType = {
            imageUrl: res.images[0].url,
            name: res.name,
            ownerName: res.owner.display_name,
            tracks,
            id: res.id,
            type: "PLAYLIST",
          }

          return getPlaylistByIdSuccess(playlist)
        }),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(
              redoLogin(),
              pushActionToRestart(getPlaylistById(playListId)),
            )
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getPlaylistByIdError())
        }),
      ),
    ),
  )

const getCurrentUserPlaylistsEpic = (actions$: Observable<Action<any>>) =>
  actions$.pipe(
    ofType(getCurrentUserPlaylists.type),
    switchMap(() =>
      SpotifyApiService.getCurrentUserPlaylists().pipe(
        map((res) => {
          const data: SavedPlaylistsType[] = res.items.map((item) => {
            return {
              owner: item.owner.display_name,
              url: (item.images[0] && item.images[0].url) || null,
              name: item.name,
              id: item.id,
            }
          })

          return getCurrentUserPlaylistsSuccess(data)
        }),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(getCurrentUserPlaylists())
          }
          // handle error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getCurrentUserPlaylistsError())
        }),
      ),
    ),
  )

export const playlistEpics = [getCurrentUserPlaylistsEpic, getPlayListByIdEpic]

export const {
  clearCurrentPlaylist,
  getCurrentUserPlaylists,
  getCurrentUserPlaylistsError,
  getCurrentUserPlaylistsSuccess,
  getPlaylistById,
  getPlaylistByIdError,
  getPlaylistByIdSuccess,
} = playlistSlice.actions
export default playlistSlice.reducer
