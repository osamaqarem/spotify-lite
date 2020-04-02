import { createSlice } from "@reduxjs/toolkit"
import { ofType } from "redux-observable"
import { Observable, of } from "rxjs"
import { catchError, map, switchMap } from "rxjs/operators"
import SpotifyAsyncStoreService from "../../services/asyncstorage/SpotifyAsyncStoreService"
import { ProfileResponse } from "../../services/network/models/spotify/ProfileResponse"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import { Action, DispatchFun } from "../rootReducer"
import { hydrate } from "./globalSlice"

type UserReducerType = {
  profile: null | ProfileResponse
  authenticated: boolean
}

const initialState: UserReducerType = {
  profile: null,
  authenticated: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getTokenSuccess: state => state,
    getProfileSuccess: (state, action) => ({
      ...state,
      profile: action.payload,
      authenticated: true,
    }),
    getProfileError: state => state,
    redoLogin: state => ({ ...state, authenticated: false }),
  },
})

export const setToken = (token: string) => async (
  dispatch: DispatchFun<string>,
) => {
  await SpotifyAsyncStoreService.putToken(token)

  dispatch(hydrate())
}

const getProfileEpic = (action$: Observable<Action<string>>) =>
  action$.pipe(
    ofType(hydrate.type),
    switchMap(() =>
      SpotifyApiService.getMyProfile().pipe(
        map(res => getProfileSuccess(res)),
        catchError(err => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(redoLogin())
          }

          // TODO: notify user of error
          console.warn(err)
          __DEV__ && console.tron(err.stack)
          return of(getProfileError())
        }),
      ),
    ),
  )

export const userEpics = [getProfileEpic]

export const {
  getTokenSuccess,
  getProfileSuccess,
  redoLogin,
  getProfileError,
} = userSlice.actions

export default userSlice.reducer
