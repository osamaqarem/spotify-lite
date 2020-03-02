import { createSlice } from "@reduxjs/toolkit"
import { ofType } from "redux-observable"
import { Observable, of } from "rxjs"
import { catchError, map, switchMap } from "rxjs/operators"
import ApiClient from "../../services/network/ApiService"
import { AlbumType } from "../../services/network/models/spotify/SpotifyCommon"
import { Action } from "../rootReducer"
import { hydrate } from "./globalSlice"
import { redoLogin } from "./userSlice"

type PersonalizationReducerType = {
  userTopArtists: AlbumType[]
  userTopArtistsHeader: AlbumType | null
}

const initialState: PersonalizationReducerType = {
  userTopArtists: [],
  userTopArtistsHeader: null,
}

const personalizationSlice = createSlice({
  name: "personalization",
  initialState,
  reducers: {
    getUserTopArtists: state => state,
    getUserTopArtistsSuccess: (state, action) => ({
      ...state,
      userTopArtists: action.payload.data,
      userTopArtistsHeader: action.payload.header,
    }),
    getUserTopArtistsError: state => state,
  },
})

const getCurrentUserTopArtistsEpic = (actions$: Observable<Action<any>>) =>
  actions$.pipe(
    ofType(hydrate.type),
    switchMap(() => ApiClient.getCurrentUserTopArtists()),
    map(res => {
      const artists: AlbumType[] = res.items.map(item => {
        return {
          name: item.name,
          imageURL: item.images[0].url,
          id: item.id,
        }
      })

      const data = artists.slice(1, artists.length)
      const header = artists[0]

      return getUserTopArtistsSuccess({ data, header })
    }),
    catchError(err => {
      if (ApiClient.sessionIsExpired(err)) {
        return of(redoLogin())
      }
      // TODO: notify user of error
      console.warn(err)
      __DEV__ && console.tron(err.stack)
      return of(getUserTopArtistsError())
    }),
  )

export const personalizationEpics = [getCurrentUserTopArtistsEpic]

export const {
  getUserTopArtists,
  getUserTopArtistsError,
  getUserTopArtistsSuccess,
} = personalizationSlice.actions
export default personalizationSlice.reducer
