import { createSlice } from "@reduxjs/toolkit"
import { ofType } from "redux-observable"
import { Observable, of } from "rxjs"
import { catchError, map, switchMap } from "rxjs/operators"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import { AlbumType } from "../../services/network/models/spotify/SpotifyCommon"
import { Action } from "../rootReducer"
import { pushActionToRestart } from "./globalSlice"
import { redoLogin } from "./userSlice"

type FollowReducerType = {
  currentUserSavedArtists: AlbumType[]
}

const initialState: FollowReducerType = {
  currentUserSavedArtists: [],
}

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    getCurrentUserSavedArtists: state => state,
    getCurrentUserSavedArtistsError: state => state,
    getCurrentUserSavedArtistsSuccess: (state, action) => ({
      ...state,
      currentUserSavedArtists: action.payload,
    }),
  },
})

const getCurrentUserSavedArtistsEpic = (actions$: Observable<Action<any>>) =>
  actions$.pipe(
    ofType(getCurrentUserSavedArtists.type),
    switchMap(() =>
      SpotifyApiService.getCurrentUserSavedArtists().pipe(
        map(res => {
          const data: AlbumType[] = res.artists.items.map(item => {
            return {
              imageURL: (item.images[0] && item.images[0].url) || null,
              name: item.name,
              id: item.id,
            }
          })

          return getCurrentUserSavedArtistsSuccess(data)
        }),
        catchError(err => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(
              redoLogin(),
              pushActionToRestart(getCurrentUserSavedArtists()),
            )
          }
          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getCurrentUserSavedArtistsError())
        }),
      ),
    ),
  )

export const followEpics = [getCurrentUserSavedArtistsEpic]

export const {
  getCurrentUserSavedArtists,
  getCurrentUserSavedArtistsSuccess,
  getCurrentUserSavedArtistsError,
} = followSlice.actions

export default followSlice.reducer
