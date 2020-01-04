import reactotron from "reactotron-react-native";
import { ofType } from "redux-observable";
import { from, Observable, of, zip } from "rxjs";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import {
  Action,
  ErrorResponse,
  FeaturedPlaylistsResponse,
  GetAllCategoriesResponse,
  GetCategoryResponse,
  PlaylistResponse,
  UserProfileResponse,
} from "../../data/models";
import { SPOTIFY_API_BASE } from "../../utils";
import { GenrePlaylist } from "../reducers/browseReducer";
import { TrackType } from "../reducers/playlistReducer";
import { RootStoreType } from "../reducers";
import { browseActions, globalActions } from "./actionTypes";
import { redoLogin } from "./userActions";

export const getAllFeaturedPlaylistsEpic = (
  actions$: Observable<Action<any>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(globalActions.REHYDRATE_FROM_API),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const { token } = state.userReducer;

      const request$ = from(
        fetch(SPOTIFY_API_BASE + "/browse/featured-playlists?limit=8", {
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
            return of(redoLogin());
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
          SPOTIFY_API_BASE + `/browse/categories?country=${profile.country}`,
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
            return of(redoLogin(), {
              type: globalActions.PUSH_ACTION_TO_RESTART,
              payload: getAllCategoriesForCountry(),
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

export const getCategoryById = ({
  id,
  title,
  getRestOfItems,
}: {
  id: string;
  title: string;
  getRestOfItems: boolean;
}) => ({
  type: browseActions.GET_CATEGORY_BY_ID,
  payload: { id, title, getRestOfItems },
});

export const getCategoryByIdEpic = (
  actions$: Observable<Action<ReturnType<typeof getCategoryById>["payload"]>>,
  state$: Observable<RootStoreType>,
) =>
  actions$.pipe(
    ofType(browseActions.GET_CATEGORY_BY_ID),
    withLatestFrom(state$),
    switchMap(([{ payload }, { userReducer }]) => {
      const { id, title, getRestOfItems } = payload!;

      if (typeof id === "string") {
        const { token } = userReducer;

        const urlQueryString = getRestOfItems ? "offset=4" : "limit=4";

        const request$ = from(
          fetch(
            SPOTIFY_API_BASE +
              `/browse/categories/${id}/playlists?${urlQueryString}`,
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
          map((res: GetCategoryResponse | ErrorResponse) => {
            if ("error" in res) {
              throw res.error.message;
            }

            // Get playlist by ID for each playlist
            const request$Array = res.playlists.items.map(item => {
              return from(
                fetch(`${SPOTIFY_API_BASE}/playlists/${item.id}`, {
                  method: "GET",
                  headers: {
                    authorization: `Bearer ${token}`,
                  },
                }),
              ).pipe(switchMap(res => res.json()));
            });

            return zip(...request$Array);
          }),
          switchMap(responseArray => responseArray),
          map(responseArray => {
            const data: GenrePlaylist[] = responseArray.map(
              (res: PlaylistResponse | ErrorResponse) => {
                if ("error" in res) throw res.error.message;

                const tracks: TrackType[] = res.tracks.items.map(item => ({
                  artistName:
                    item.track?.artists[0].name ??
                    "No track returned by spotify :(",
                  name: item.track?.name ?? "No track",
                }));

                const playlist: GenrePlaylist = {
                  imageUrl: res.images[0].url,
                  name: res.name,
                  ownerName: res.owner.display_name,
                  followerCount: res.followers.total,
                  tracks,
                };

                return playlist;
              },
            );

            if (!getRestOfItems) {
              return {
                type: browseActions.GET_CATEGORY_BY_ID_SUCCESS,
                payload: { data, title, id },
              };
            } else {
              return {
                type: browseActions.GET_MORE_CATEGORY_BY_ID_SUCCESS,
                payload: { data },
              };
            }
          }),
          catchError(err => {
            if (typeof err === "string" && err.includes("expired")) {
              return of(redoLogin(), {
                type: globalActions.PUSH_ACTION_TO_RESTART,
                payload: getCategoryById({ id, title, getRestOfItems }),
              });
            }
            // handle error
            reactotron.log(JSON.stringify(err));
            return of({
              type: browseActions.GET_CATEGORY_BY_ID_ERROR,
              payload: err,
            });
          }),
        );
      } else {
        return of({
          type: browseActions.GET_CATEGORY_BY_ID_ERROR,
          payload: "Invalid ID",
        });
      }
    }),
  );

export const clearCategoryPlaylists = () => ({
  type: browseActions.CLEAR_CATEGORY_PLAYLISTS,
});
