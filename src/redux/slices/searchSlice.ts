import { createSlice } from "@reduxjs/toolkit"
import reactotron from "reactotron-react-native"
import { ofType } from "redux-observable"
import { concat, EMPTY, Observable, of, timer } from "rxjs"
import { catchError, debounce, map, mergeMap, switchMap } from "rxjs/operators"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import { SearchResponse } from "../../services/network/models/spotify/SearchResponse"
import { AlbumType } from "../../services/network/models/spotify/SpotifyCommon"
import { Action } from "../rootReducer"
import { redoLogin } from "./userSlice"

export type ResultKey = "albums" | "tracks" | "artists" | "playlists" | "random"
export type SearchResult = Record<ResultKey, AlbumType[]>

type SearchReducerType = {
  results: SearchResult
  resultsHave: {
    havePlaylists: boolean
    haveAlbums: boolean
    haveTracks: boolean
    haveArtists: boolean
  }
  queryLoading: boolean
  queryEmpty: boolean
  lastQuery: string
  queryHistory: AlbumType[]
  seeAll: { data: AlbumType[]; type: AlbumType["type"] | null }
}

const initialState: SearchReducerType = {
  results: {
    albums: [],
    artists: [],
    playlists: [],
    tracks: [],
    random: [],
  },
  resultsHave: {
    havePlaylists: false,
    haveAlbums: false,
    haveTracks: false,
    haveArtists: false,
  },
  queryLoading: false,
  queryEmpty: false,
  lastQuery: "",
  queryHistory: [],
  seeAll: { data: [], type: null },
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    getQuery: (state, _) => state,
    querySuccess: (state, action) => ({
      ...state,
      results: action.payload.results,
      resultsHave: action.payload.resultsHave,
      queryLoading: false,
      lastQuery: action.payload.query,
    }),
    queryError: state => ({
      ...state,
      lastQuery: "",
      queryLoading: false,
    }),
    queryLoading: state => ({
      ...state,
      queryLoading: true,
      queryEmpty: false,
      lastQuery: "",
      results: initialState.results,
      resultsHave: initialState.resultsHave,
    }),
    queryEmpty: (state, action) => ({
      ...state,
      queryLoading: false,
      queryEmpty: true,
      lastQuery: action.payload,
    }),
    querySave: (state, action) => {
      if (
        state.queryHistory.findIndex(item => item.id === action.payload.id) ===
        -1
      ) {
        return {
          ...state,
          queryHistory: [action.payload, ...state.queryHistory],
        }
      } else {
        return state
      }
    },
    queryDelete: (state, action) => {
      const historyCopy = [...state.queryHistory]
      const deleteIndex = historyCopy.findIndex(
        item => item.id === action.payload.id,
      )
      historyCopy.splice(deleteIndex, 1)
      return {
        ...state,
        queryHistory: historyCopy,
      }
    },
    queryDeleteAll: state => ({
      ...state,
      queryHistory: [],
    }),
    querySetSeeAll: (state, action) => ({
      ...state,
      seeAll: { data: action.payload.data, type: action.payload.type },
    }),
  },
})

const searchForQueryEpic = (actions$: Observable<Action<string>>) =>
  actions$.pipe(
    ofType(getQuery.type),
    debounce(action => {
      return action.payload?.length === 0 ? EMPTY : timer(500)
    }),
    switchMap(action => {
      const query = action.payload as string

      const request$ = SpotifyApiService.search(query).pipe(
        map(data => {
          if (queryResponseIsEmpty(data)) {
            return of(queryEmpty(query))
          }

          const results = prepareSearchResults(data)
          const resultsHave = getResultsHave(data)

          const topSearchResults = sortByMostPopular(results)
          results.random = sortBySongAndArtistFirst(topSearchResults)

          return of(querySuccess({ results, resultsHave, query }))
        }),
        mergeMap(a => a),
        catchError(err => {
          if (SpotifyApiService.sessionIsExpired(err)) {
            return of(redoLogin())
          }
          // TODO: notify user of error
          reactotron.log!(err)
          return of(queryError())
        }),
      )
      return concat(of(queryLoading()), request$)
    }),
  )

export const setSeeAll = (data: AlbumType[]) => {
  switch (data[0].type) {
    case "Album":
      return querySetSeeAll({ data, type: "Albums" })
    case "Artist":
      return querySetSeeAll({ data, type: "Artists" })
    case "Playlist":
      return querySetSeeAll({ data, type: "Playlists" })
    case "Song":
      return querySetSeeAll({ data, type: "Songs" })
    default:
      throw new Error("setSeeAll: Unexpected data type.")
  }
}

const queryResponseIsEmpty = (data: SearchResponse) => {
  const albumsEmpty = data.albums.items.length === 0
  const tracksEmpty = data.tracks.items.length === 0
  const playlistsEmpty = data.playlists.items.length === 0
  const artistsEmpty = data.artists.items.length === 0

  if (albumsEmpty && tracksEmpty && playlistsEmpty && artistsEmpty) {
    return true
  } else {
    return false
  }
}

const prepareSearchResults = (data: SearchResponse) => {
  const results: SearchResult = {
    albums: data.albums.items.map(item => ({
      name: item.name,
      imageURL: item.images[0]?.url,
      id: item.id,
      type: "Album",
    })),
    tracks: data.tracks.items.map(item => ({
      name: item.name,
      imageURL: item.album.images[0]?.url,
      id: item.id,
      type: "Song",
      artist: item.artists[0].name,
      popularity: item.popularity,
    })),
    artists: data.artists.items.map(item => ({
      name: item.name,
      imageURL: item.images[0]?.url,
      id: item.id,
      type: "Artist",
      popularity: item.popularity,
    })),
    playlists: data.playlists.items.map(item => ({
      name: item.name,
      imageURL: item.images[0]?.url,
      id: item.id,
      type: "Playlist",
    })),
    random: [],
  }

  return results
}

const getResultsHave = (data: SearchResponse) => {
  return {
    havePlaylists: data.playlists.items.length > 0,
    haveAlbums: data.albums.items.length > 0,
    haveTracks: data.tracks.items.length > 0,
    haveArtists: data.artists.items.length > 0,
  }
}

const sortByMostPopular = (results: SearchResult) => {
  const keyList: ResultKey[] = ["albums", "artists", "playlists", "tracks"]

  // Number of items that will be initially displayed in the UI (results.random)
  const TOP_RESULTS_COUNT = 7

  // attempts must be >= TOP_RESULTS_COUNT
  // higher -> longer processing time, but more likely to populate all 7 values
  // lower -> shorter processing time, but less likely to populate all 7 values
  const ATTEMPTS = 50
  let topSearchResults: AlbumType[] = []

  // Get random item from a random array, until we have 7 items.
  for (let i = 0; i < ATTEMPTS; i++) {
    if (topSearchResults.length === TOP_RESULTS_COUNT) break

    const randomKey = keyList[Math.floor(Math.random() * keyList.length)]

    const randomArray = results[randomKey]

    if (
      (randomKey === "artists" || randomKey === "tracks") &&
      randomArray.length > 0
    ) {
      const mostPopular = randomArray.reduce((prev, current) => {
        const notPreviouslyAdded =
          topSearchResults.findIndex(item => item.id === current.id) === -1

        if (!notPreviouslyAdded) return prev

        if (prev.popularity! > current.popularity!) {
          return prev
        } else {
          return current
        }
      })

      // In case artists or tracks key was randomly selected again, then we can still have duplicates
      const notPreviouslyAdded =
        topSearchResults.findIndex(item => item.id === mostPopular.id) === -1

      if (notPreviouslyAdded) {
        topSearchResults.push(mostPopular)
      }
    } else {
      for (let j = 0; j < randomArray.length; j++) {
        // for playlists and albums the results with the lowest index tend to be the most correct.
        const randomItem = randomArray[j]

        const notPreviouslyAdded =
          topSearchResults.findIndex(item => item.id === randomItem.id) === -1

        if (notPreviouslyAdded) {
          topSearchResults.push(randomItem)
          break
        }
      }
    }

    // If some response data is empty, randomItem could be undefined.
    topSearchResults = topSearchResults.filter(
      item => typeof item != "undefined",
    )
  }

  return topSearchResults
}

const sortBySongAndArtistFirst = (topSearchResults: AlbumType[]) => {
  return topSearchResults.sort((firstItem, secondItem) => {
    const firstItemIsArtistOrSong =
      firstItem.type === "Song" || firstItem.type === "Artist"
    const secondItemIsArtistOrSong =
      secondItem.type === "Song" || secondItem.type === "Artist"

    if (
      (firstItemIsArtistOrSong && secondItemIsArtistOrSong) ||
      (!firstItemIsArtistOrSong && !secondItemIsArtistOrSong)
    ) {
      return 0
    } else if (firstItemIsArtistOrSong && !secondItemIsArtistOrSong) {
      return -1
    } else if (!firstItemIsArtistOrSong && secondItemIsArtistOrSong) {
      return 1
    } else {
      return 0
    }
  })
}

export const searchEpics = [searchForQueryEpic]

export const {
  getQuery,
  queryDelete,
  queryDeleteAll,
  queryEmpty,
  queryError,
  queryLoading,
  querySave,
  querySetSeeAll,
  querySuccess,
} = searchSlice.actions

export default searchSlice.reducer
