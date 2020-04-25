import { createSlice } from "@reduxjs/toolkit"
import { ofType } from "redux-observable"
import { EMPTY, interval, Observable, of } from "rxjs"
import { catchError, map, startWith, switchMap } from "rxjs/operators"
import { AlbumType } from "../../services/network/models/spotify/SpotifyCommon"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import { Action } from "../rootReducer"
import { hydrate, pushActionToRestart } from "./globalSlice"
import { getPlaylistByIdSuccess, PlaylistDetailsType } from "./playlistSlice"
import { redoLogin } from "./userSlice"

type AlbumReducerType = {
  recentlyPlayedAlbums: AlbumType[]
}

const initialState: AlbumReducerType = {
  recentlyPlayedAlbums: [],
}

const albumSlice = createSlice({
  initialState,
  name: "album",
  reducers: {
    getAlbumById: (state, _) => state,
    getAlbumError: (state) => state,
    getMultipleAlbums: (state, _) => state,
    getMultipleAlbumsError: (state) => state,
    getMultipleAlbumsSuccess: (state, action) => ({
      ...state,
      recentlyPlayedAlbums: action.payload,
    }),
    getRecentlyPlayedTracksError: (state) => state,
  },
})

const getAlbumByIdEpic = (actions$: Observable<Action<any>>) =>
  actions$.pipe(
    ofType(getAlbumById.type),
    switchMap(({ payload: id }) =>
      SpotifyApiService.getAlbum(id).pipe(
        map((res) => {
          const tracks = res.tracks.items.map((track, i) => ({
            name: track.name,
            artistName: track.artists[i]?.name || res.artists[0].name,
          }))

          const album: PlaylistDetailsType = {
            name: res.name,
            ownerName: res.artists[0].name,
            tracks,
            imageUrl: res.images[0].url,
            id: res.id,
            type: "ALBUM",
          }

          return getPlaylistByIdSuccess(album)
        }),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(redoLogin(), pushActionToRestart(getAlbumById(id)))
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getAlbumError.type)
        }),
      ),
    ),
  )

const getMultipleAlbumsEpic = (actions$: Observable<Action<any>>) =>
  actions$.pipe(
    ofType(getMultipleAlbums.type),
    switchMap(({ payload: ids }) =>
      SpotifyApiService.getMultipleAlbums(ids).pipe(
        map((res) => {
          // we want array of url strings
          const albumImageUrls: AlbumType[] = res.albums.map((album) => ({
            name: album.name,
            // [2] is lowest quality
            // [0] is highest quality
            imageURL: album.images[0].url,
            id: album.id,
          }))

          return getMultipleAlbumsSuccess(albumImageUrls)
        }),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(redoLogin(), pushActionToRestart(getMultipleAlbums(ids)))
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getMultipleAlbumsError())
        }),
      ),
    ),
  )

const getRecentlyPlayedTracksEpic = (actions$: Observable<Action<undefined>>) =>
  actions$.pipe(
    ofType(hydrate.type),
    switchMap(() => interval(180 * 1000).pipe(startWith(EMPTY))),
    switchMap(() =>
      SpotifyApiService.getRecentlyPlayedTracks().pipe(
        map((res) => {
          let commaList = ""
          res.items.forEach((item) => {
            const [, albumId] = item.track.album.href.split("albums/")
            if (!commaList.includes(albumId))
              commaList = commaList.concat(albumId + ",")
          })
          // Remove last comma. else request fails
          const commaListCommaRemoved = commaList.slice(0, commaList.length - 1)

          return getMultipleAlbums(commaListCommaRemoved)
        }),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            // dont do anything
            return of({ type: "getRecentlyPlayedTracksEpic: catchError" })
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getRecentlyPlayedTracksError())
        }),
      ),
    ),
  )

export const albumEpics = [
  getAlbumByIdEpic,
  getMultipleAlbumsEpic,
  getRecentlyPlayedTracksEpic,
]
export const {
  getAlbumById,
  getAlbumError,
  getMultipleAlbums,
  getMultipleAlbumsSuccess,
  getMultipleAlbumsError,
  getRecentlyPlayedTracksError,
} = albumSlice.actions

export default albumSlice.reducer
