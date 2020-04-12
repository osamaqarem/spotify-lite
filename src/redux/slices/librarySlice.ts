import { createSlice } from "@reduxjs/toolkit"
import { ofType } from "redux-observable"
import { Observable, of } from "rxjs"
import { catchError, map, switchMap } from "rxjs/operators"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import { Action } from "../rootReducer"
import { PlaylistDetailsType, TrackType } from "./playlistSlice"

export type SavedAlbumType = {
  name: string
  url: string | null
  owner: string
  id: string
}

type LibraryReducerType = {
  currentUserSavedTracksCount: null | number
  currentUserSavedTracks: PlaylistDetailsType | null
  currentUserSavedAlbums: SavedAlbumType[]
}

const initialState: LibraryReducerType = {
  currentUserSavedTracksCount: null,
  currentUserSavedTracks: null,
  currentUserSavedAlbums: [],
}
const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    getCurrentUserSavedTracks: (state) => state,
    getCurrentUserSavedTracksError: (state) => state,
    getCurrentUserSavedTracksSuccess: (state, action) => ({
      ...state,
      currentUserSavedTracksCount: action.payload.count,
      currentUserSavedTracks: action.payload.data,
    }),
    getCurrentUserSavedAlbums: (state) => state,
    getCurrentUserSavedAlbumsError: (state) => state,
    getCurrentUserSavedAlbumsSuccess: (state, action) => ({
      ...state,
      currentUserSavedAlbums: action.payload,
    }),
  },
})

const getCurrentUserSavedTracksEpic = (actions$: Observable<Action<any>>) =>
  actions$.pipe(
    ofType(getCurrentUserSavedTracks.type),
    switchMap(() =>
      SpotifyApiService.getCurrentUserSavedTracks().pipe(
        map((res) => {
          const tracks: TrackType[] = res.items.map((item) => ({
            artistName: item.track.artists[0].name,
            name: item.track.name,
          }))

          const data: PlaylistDetailsType = {
            imageUrl: "https://i.imgur.com/N1uXnyS.jpg",
            tracks,
            name: "Favorite Songs",
            ownerName: null,
            id: null,
            type: "PLAYLIST",
          }

          return getCurrentUserSavedTracksSuccess({ count: res.total, data })
        }),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(getCurrentUserSavedTracks())
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getCurrentUserSavedTracksError())
        }),
      ),
    ),
  )

const getCurrentUserSavedAlbumsEpic = (actions$: Observable<Action<any>>) =>
  actions$.pipe(
    ofType(getCurrentUserSavedAlbums.type),
    switchMap(() =>
      SpotifyApiService.getCurrentUserSavedAlbums().pipe(
        map((res) => {
          const data: SavedAlbumType[] = res.items.map((item) => {
            return {
              owner: item.album.artists[0].name,
              url: (item.album.images[0] && item.album.images[0].url) || null,
              name: item.album.name,
              id: item.album.id,
            }
          })

          return getCurrentUserSavedAlbumsSuccess(data)
        }),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(getCurrentUserSavedAlbums())
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getCurrentUserSavedAlbumsError())
        }),
      ),
    ),
  )

export const libraryEpics = [
  getCurrentUserSavedTracksEpic,
  getCurrentUserSavedAlbumsEpic,
]
export const {
  getCurrentUserSavedAlbums,
  getCurrentUserSavedAlbumsError,
  getCurrentUserSavedAlbumsSuccess,
  getCurrentUserSavedTracks,
  getCurrentUserSavedTracksError,
  getCurrentUserSavedTracksSuccess,
} = librarySlice.actions
export default librarySlice.reducer
