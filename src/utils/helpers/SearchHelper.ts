import { SearchResponse, AlbumType } from "../../data/models/spotify";
import { SearchResult, ResultKey } from "../../redux/reducers/searchReducer";

const queryResponseIsEmpty = (data: SearchResponse) => {
  const albumsEmpty = data.albums.items.length === 0;
  const tracksEmpty = data.tracks.items.length === 0;
  const playlistsEmpty = data.playlists.items.length === 0;
  const artistsEmpty = data.artists.items.length === 0;

  if (albumsEmpty && tracksEmpty && playlistsEmpty && artistsEmpty) {
    return true;
  } else {
    return false;
  }
};

const prepareSearchResult = (data: SearchResponse) => {
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
  };

  return results;
};

const getResultsHave = (data: SearchResponse) => {
  return {
    havePlaylists: data.playlists.items.length > 0,
    haveAlbums: data.albums.items.length > 0,
    haveTracks: data.tracks.items.length > 0,
    haveArtists: data.artists.items.length > 0,
  };
};

const sortByMostPopular = (results: SearchResult) => {
  const keyList: ResultKey[] = ["albums", "artists", "playlists", "tracks"];

  const TOP_RESULTS_COUNT = 7;
  let topSearchResults: AlbumType[] = [];

  // Get random item from a random array, until we have 7 items.
  for (let i = 0; i < 50; i++) {
    if (topSearchResults.length === TOP_RESULTS_COUNT) break;

    const randomKey = keyList[Math.floor(Math.random() * keyList.length)];

    const randomArray = results[randomKey];

    if (randomKey === "artists" || randomKey === "tracks") {
      const mostPopular = randomArray.reduce((prev, current) => {
        const doesNotExist =
          topSearchResults.findIndex(item => item === current) === -1;

        if (!doesNotExist) return prev;

        if (prev.popularity! > current.popularity!) {
          return prev;
        } else {
          return current;
        }
      });

      topSearchResults.push(mostPopular);
    } else {
      let randomItem =
        randomArray[Math.floor(Math.random() * randomArray.length)];

      topSearchResults.push(randomItem);
    }

    // 1- If some response data is empty, randomItem could be undefined.
    // 2- Create a Set to get rid of duplicates.
    topSearchResults = [...new Set(topSearchResults)].filter(
      item => typeof item != "undefined",
    );
  }

  return topSearchResults;
};

const sortBySongAndArtistFirst = (topSearchResults: AlbumType[]) => {
  return topSearchResults.sort((firstItem, secondItem) => {
    const firstItemIsArtistOrSong =
      firstItem.type === "Song" || firstItem.type === "Artist";
    const secondItemIsArtistOrSong =
      secondItem.type === "Song" || secondItem.type === "Artist";

    if (
      (firstItemIsArtistOrSong && secondItemIsArtistOrSong) ||
      (!firstItemIsArtistOrSong && !secondItemIsArtistOrSong)
    ) {
      return 0;
    } else if (firstItemIsArtistOrSong && !secondItemIsArtistOrSong) {
      return -1;
    } else if (!firstItemIsArtistOrSong && secondItemIsArtistOrSong) {
      return 1;
    } else {
      return 0;
    }
  });
};

const SearchHelper = {
  queryResponseIsEmpty,
  prepareSearchResult,
  getResultsHave,
  sortByMostPopular,
  sortBySongAndArtistFirst,
};

export default SearchHelper;
