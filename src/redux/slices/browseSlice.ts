import { createSlice } from "@reduxjs/toolkit"
import { ofType } from "redux-observable"
import { concat, Observable, of, zip } from "rxjs"
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from "rxjs/operators"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import {
  AlbumType,
  Playlist,
} from "../../services/network/models/spotify/SpotifyCommon"
import { Action, RootStoreType } from "../rootReducer"
import { pushActionToRestart, hydrate } from "./globalSlice"
import { PlaylistDetailsType, TrackType } from "./playlistSlice"
import { redoLogin } from "./userSlice"

export type CountryCategoryType = { name: string; id: string }

type BorwserReducerType = {
  featuredPlaylists: AlbumType[]
  categoriesForCountry: CountryCategoryType[]
  genreDetails: {
    genrePlaylists: PlaylistDetailsType[]
    title: string | null
    id: string | null
  }
  isLoading: boolean
}

const initialState: BorwserReducerType = {
  featuredPlaylists: [],
  categoriesForCountry: [],
  genreDetails: { genrePlaylists: [], title: null, id: null },
  isLoading: false,
}

const browseSlice = createSlice({
  name: "browse",
  initialState,
  reducers: {
    getAllFeaturedPlaylistsSuccess: (state, action) => ({
      ...state,
      featuredPlaylists: action.payload,
    }),
    getAllFeaturedPlaylistsError: (state) => state,
    getAllCategoriesForCountry: (state) => state,
    getAllCategoriesForCountrySuccess: (state, action) => ({
      ...state,
      categoriesForCountry: action.payload,
    }),
    getAllCategoriesForCountryError: (state) => state,
    getCategoryById: (state, _) => state,
    getCategoryByIdSuccess: (state, action) => ({
      ...state,
      genreDetails: {
        genrePlaylists: action.payload.data,
        title: action.payload.title,
        id: action.payload.id,
      },
    }),
    getCategoryByIdError: (state) => state,
    getMoreCategoriesByIdSuccess: (state, action) => ({
      ...state,
      genreDetails: {
        ...state.genreDetails,
        genrePlaylists: [
          ...state.genreDetails.genrePlaylists,
          ...action.payload.data,
        ],
      },
    }),
    isLoading: (state) => ({ ...state, isLoading: true }),
    isNotLoading: (state) => ({ ...state, isLoading: false }),
  },
})

const getAllFeaturedPlaylistsEpic = (actions$: Observable<Action<any>>) =>
  actions$.pipe(
    ofType(hydrate.type),
    switchMap(() =>
      SpotifyApiService.getAllFeaturedPlaylists().pipe(
        map((res) => {
          const data: AlbumType[] = res.playlists.items.map((item) => ({
            name: item.name,
            imageURL: item.images[0].url,
            id: item.id,
          }))

          return getAllFeaturedPlaylistsSuccess(data)
        }),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            // dont do anything
            return of({ type: "getAllFeaturedPlaylistsEpic: catchError" })
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getAllFeaturedPlaylistsError())
        }),
      ),
    ),
  )

const getAllCategoriesForCountryEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(getAllCategoriesForCountry.type),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { profile } = state.userReducer
      return SpotifyApiService.getAllCategoriesForCountry(
        profile?.country!,
      ).pipe(
        map((res) => {
          const data = res.categories.items

          const dataWithoutFirstElement = data.slice(1, data.length - 1)

          const categories = dataWithoutFirstElement.map((item) => {
            return { name: item.name, id: item.id }
          })

          return getAllCategoriesForCountrySuccess(categories)
        }),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(
              redoLogin(),
              pushActionToRestart(getAllCategoriesForCountry()),
            )
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getAllCategoriesForCountryError())
        }),
      )
    }),
  )

const getCategoryByIdEpic = (actions$: Observable<Action<any>>) =>
  actions$.pipe(
    ofType(getCategoryById.type),
    switchMap(({ payload }) => {
      const { id, title, getRestOfItems } = payload

      const urlQuery = getRestOfItems ? "offset=4" : "limit=4"

      const request$ = SpotifyApiService.getCategory(id, urlQuery).pipe(
        map((res) => {
          if (res.playlists.items.length === 0) {
            return of(getCategoryByIdSuccess({ data: [], title, id }))
          }

          // Get playlist by ID for each playlist
          const request$Array = res.playlists.items.map((item) => {
            return SpotifyApiService.getPlaylist(item.id)
          })

          return zip(...request$Array)
        }),
        switchMap((data$) => data$),
        map((result) => {
          if (!Array.isArray(result)) {
            return of(result as Action<any>)
          }

          const data: PlaylistDetailsType[] = result.map((res: Playlist) => {
            const tracks: TrackType[] = res.tracks.items.map((item) => ({
              artistName:
                item.track?.artists[0].name ??
                "No track returned by spotify :(",
              name: item.track?.name ?? "No track",
            }))

            const playlist: PlaylistDetailsType = {
              imageUrl: res.images[0].url,
              name: res.name,
              ownerName: res.owner.display_name,
              followerCount: res.followers.total,
              tracks,
              id: res.id,
            }

            return playlist
          })

          if (!getRestOfItems) {
            return of(
              getCategoryByIdSuccess({ data, title, id }),
              isNotLoading(),
            )
          } else {
            return of(getMoreCategoriesByIdSuccess({ data }), isNotLoading())
          }
        }),
        mergeMap((a) => a),
        catchError((err) => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(
              redoLogin(),
              pushActionToRestart(
                getCategoryById({ id, title, getRestOfItems }),
              ),
            )
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getCategoryByIdError(), isNotLoading())
        }),
      )

      return concat(of(isLoading()), request$)
    }),
  )

export const browseEpics = [
  getAllFeaturedPlaylistsEpic,
  getAllCategoriesForCountryEpic,
  getCategoryByIdEpic,
]
export const {
  isLoading,
  getAllCategoriesForCountrySuccess,
  getAllFeaturedPlaylistsSuccess,
  getCategoryByIdSuccess,
  getMoreCategoriesByIdSuccess,
  isNotLoading,
  getAllFeaturedPlaylistsError,
  getAllCategoriesForCountry,
  getAllCategoriesForCountryError,
  getCategoryById,
  getCategoryByIdError,
} = browseSlice.actions
export default browseSlice.reducer
