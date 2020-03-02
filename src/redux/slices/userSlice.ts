import { createSlice } from "@reduxjs/toolkit"
import { ofType } from "redux-observable"
import { Observable, of } from "rxjs"
import { catchError, map, switchMap } from "rxjs/operators"
import AsyncStore from "../../services/asyncstorage/AsyncStore"
import ApiClient from "../../services/network/ApiService"
import { ProfileResponse } from "../../services/network/models/spotify/ProfileResponse"
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
  await AsyncStore.putToken(token)

  dispatch(hydrate())
}

const getProfileEpic = (action$: Observable<Action<string>>) =>
  action$.pipe(
    ofType(hydrate.type),
    switchMap(() => ApiClient.getMyProfile()),
    map(res => getProfileSuccess(res)),
    catchError(err => {
      // TODO: notify user of error
      if (ApiClient.sessionIsExpired(err)) {
        return of(redoLogin())
      }
      console.warn(err)
      __DEV__ && console.tron(err.stack)
      return of(getProfileError())
    }),
  )

export const userEpics = [getProfileEpic]

export const {
  getTokenSuccess,
  getProfileSuccess,
  redoLogin,
  getProfileError,
} = userSlice.actions

export default userSlice.reducer
