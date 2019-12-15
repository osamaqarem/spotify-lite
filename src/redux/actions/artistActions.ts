import { artistActions } from "./actionTypes";
import { Observable, of } from "rxjs";
import { Action } from "../../data/models";
import { RootStoreType } from "../store";
import { ofType } from "redux-observable";
import { switchMap, withLatestFrom } from "rxjs/operators";

export const getArtistsTopTracks = (artistId:string) => ({type: artistActions.GET_ARTISTS_TOP_TRACKS, payload: artistId});

// TODO: get artists top tracks, get related artists (new screen)
export const getArtistsTopTracksEpic = (actions$: Observable<Action<string>>, state$: Observable<RootStoreType>) => 

  actions$.pipe(
    ofType(artistActions.GET_ARTISTS_TOP_TRACKS),
    withLatestFrom(state$),
    switchMap(([{payload:artistId},state]) => {
      const {token} = state.userReducer;

      return of({});
    })