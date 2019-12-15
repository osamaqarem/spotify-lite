import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  Action,
  ErrorResponse,
  FeaturedPlaylistsResponse,
  GetAllCategoriesResponse,
  UserProfileResponse,
} from "../../data/models";
import { SPOTIFY_API_BASE } from "../../utils";
import { userActions, browseActions } from "./actionTypes";

export const getAllFeaturedPlaylists = () => ({
  type: browseActions.GET_ALL_FEATURED_PLAYLISTS,
});

export const getAllFeaturedPlaylistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(browseActions.GET_ALL_FEATURED_PLAYLISTS),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.userReducer;

      const request$ = from(
        fetch(SPOTIFY_API_BASE + "/v1/browse/featured-playlists?limit=8", {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        }),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: FeaturedPlaylistsResponse | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          const data = res.playlists.items.map(item => {
            return { name: item.name, url: item.images[0].url, id: item.id };
          });

          return {
            type: browseActions.GET_ALL_FEATURED_PLAYLISTS_SUCCESS,
            payload: data,
          };
        }),
        catchError(err => {
          if (typeof err === "string" && err.includes("expired")) {
            return of({
              type: userActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.userReducer.refreshToken,
                actionToRestart: getAllFeaturedPlaylists(),
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: browseActions.GET_ALL_FEATURED_PLAYLISTS_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );

export const getAllCategoriesForCountry = () => ({
  type: browseActions.GET_ALL_CATEGORIES_FOR_COUNTRY,
});

export const getAllCategoriesForCountryEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<any>,
) =>
  actions$.pipe(
    ofType(browseActions.GET_ALL_CATEGORIES_FOR_COUNTRY),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const {
        token,
        profile,
      }: { token: string; profile: UserProfileResponse } = state.userReducer;

      const request$ = from(
        fetch(
          SPOTIFY_API_BASE + `/v1/browse/categories?country=${profile.country}`,
          {
            method: "GET",
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      return request$.pipe(
        switchMap(res => res.json()),
        map((res: GetAllCategoriesResponse | ErrorResponse) => {
          if ("error" in res) {
            throw res.error.message;
          }

          const data = res.categories.items;

          const dataWithoutFirstElement = data.slice(1, data.length - 1);

          const categories = dataWithoutFirstElement.map(item => {
            return { name: item.name, id: item.id };
          });

          return {
            type: browseActions.GET_ALL_CATEGORIES_FOR_COUNTRY_SUCCESS,
            payload: categories,
          };
        }),
        catchError(err => {
          if (typeof err === "string" && err.includes("expired")) {
            return of({
              type: userActions.REFRESH_TOKEN,
              payload: {
                refreshToken: state.userReducer.refreshToken,
                actionToRestart: getAllCategoriesForCountry(),
              },
            });
          }
          // handle error
          reactotron.log(JSON.stringify(err));
          return of({
            type: browseActions.GET_ALL_CATEGORIES_FOR_COUNTRY_ERROR,
            payload: err,
          });
        }),
      );
    }),
  );
