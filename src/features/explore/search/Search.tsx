import React, { useEffect, useRef, useState, useCallback } from "react"
import {
  ActivityIndicator,
  EmitterSubscription,
  Keyboard,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  BackHandler,
} from "react-native"
import { NavigationEvents, SafeAreaView, ScrollView } from "react-navigation"
import { NavigationStackProp } from "react-navigation-stack"
import { connect, ConnectedProps } from "react-redux"
import SearchIcon from "../../navigation/components/navigators/bottom-tabs/icons/SearchIcon"
import { SEARCH_BAR_HEIGHT } from "../components/TopBarSearch"
import BackBtnSearch from "./components/BackBtnSearch"
import CrossIcon from "../../../common/components/CrossIcon"
import NoResults from "./components/NoResults"
import ResultRow from "./components/ResultRow"
import SearchHistory from "./components/SearchHistory"
import SearchIntro from "./components/SearchIntro"
import SeeAllBtn from "./components/SeeAllBtn"
import { Routes } from "../../navigation/_routes"
import { AlbumType } from "../../../services/network/models/spotify/SpotifyCommon"
import {
  getQuery,
  querySave,
  queryDelete,
  queryDeleteAll,
  querySetSeeAll,
} from "../../../redux/slices/searchSlice"
import { setArtistId } from "../../../redux/slices/artistSlice"
import { getAlbumById } from "../../../redux/slices/albumSlice"
import { getPlaylistById } from "../../../redux/slices/playlistSlice"
import { RootStoreType } from "../../../redux/rootReducer"
import { colors } from "../../../common/theme"

type SearchType = { navigation: NavigationStackProp } & ReduxProps

let keyboardWillHideListener: EmitterSubscription

const Search = ({
  navigation,
  getQuery,
  querySave,
  queryDelete,
  loading,
  queryEmpty,
  lastQuery,
  queryHistory,
  results,
  resultsHave,
  queryDeleteAll,
  querySetSeeAll,
  setArtistId,
  getAlbumById,
  getPlaylistById,
}: SearchType) => {
  const [showBack, setShowBack] = useState(false)
  const [query, setQuery] = useState("")
  const searchInput = useRef<TextInput>(null)

  useEffect(() => {
    if (results && loading) {
      results.random = []
    }
  }, [loading, results])

  const handleWillFocus = useCallback(() => {
    StatusBar.setBarStyle("light-content")
  }, [])

  const handleDidFocus = useCallback(() => {
    keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", () =>
      setShowBack(false),
    )
  }, [])

  const handleWillBlur = useCallback(() => {
    keyboardWillHideListener && keyboardWillHideListener.remove()
  }, [])

  const handleInputFocus = useCallback(() => {
    setShowBack(true)
  }, [])

  const handleQuery = useCallback(
    (text: string) => {
      setQuery(text)
      getQuery(text)
    },
    [getQuery],
  )

  const handleClear = useCallback(() => {
    getQuery("")
    setQuery("")
    setShowBack(false)
    Keyboard.dismiss()
  }, [getQuery])

  const handleResultPress = useCallback(
    (item: AlbumType) => {
      querySave(item)
      switch (item.type) {
        case "Artist":
          setArtistId(item.id)
          navigation.navigate(Routes.BottomTabs.ExploreStack.ArtistDetails)
          return
        case "Album":
          getAlbumById(item.id)
          navigation.navigate(Routes.BottomTabs.ExploreStack.PlaylistDetails)
          return
        case "Playlist":
          getPlaylistById(item.id)
          navigation.navigate(Routes.BottomTabs.ExploreStack.PlaylistDetails)
          return
      }
    },
    [getAlbumById, getPlaylistById, navigation, querySave, setArtistId],
  )

  const handleRemove = useCallback(
    (item: AlbumType) => {
      queryDelete(item)
    },
    [queryDelete],
  )

  const handleclearAll = useCallback(() => {
    queryDeleteAll()
    searchInput.current?.focus()
  }, [queryDeleteAll])

  const handleSeeAll = useCallback(
    (data: AlbumType[], type: AlbumType["type"]) => {
      querySetSeeAll({ data, type })
      navigation.navigate(Routes.BottomTabs.ExploreStack.SeeAll)
    },
    [navigation, querySetSeeAll],
  )

  const handleBack = useCallback(() => {
    handleClear()
    navigation.goBack()
    return true
  }, [handleClear, navigation])

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBack)
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack)
    }
  }, [handleBack])

  const showLoading = query.length > 0 && loading
  const showResults = results.random.length > 0
  const showEmptyResult = queryEmpty && lastQuery.length > 0
  const normalState = !showResults && !loading && !showEmptyResult
  const showHistory = queryHistory.length > 0 && normalState
  const showIntro = !showHistory && normalState

  return (
    <SafeAreaView style={styles.container}>
      <NavigationEvents
        onWillFocus={handleWillFocus}
        onDidFocus={handleDidFocus}
        onWillBlur={handleWillBlur}
      />
      <View style={styles.searchBarContainer}>
        <>
          {(!showBack && (
            <SearchIcon
              tintColor={colors.lightGrey}
              textStyle={styles.searchIcon}
            />
          )) || (
            <BackBtnSearch
              onPress={handleBack}
              tintColor={colors.lightGrey}
              textStyle={styles.backBtnIcon}
            />
          )}
        </>
        <TextInput
          ref={searchInput}
          autoFocus
          numberOfLines={1}
          value={query}
          onChangeText={handleQuery}
          onFocus={handleInputFocus}
          placeholder="Search artists, songs and playlists"
          placeholderTextColor={colors.darkGrey}
          selectionColor={colors.white}
          style={styles.searchInput}
        />
        {showBack && query.length > 0 && (
          <CrossIcon
            size={28}
            color={colors.lightGrey}
            handlePress={handleClear}
            iconStyle={styles.clearIcon}
          />
        )}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        {showHistory && (
          <SearchHistory
            clearAll={handleclearAll}
            queryHistory={queryHistory}
            handleRemove={handleRemove}
            handleResultPress={handleResultPress}
          />
        )}
        {(showIntro && <SearchIntro />) ||
          (showLoading && (
            <ActivityIndicator
              style={styles.indicator}
              size={50}
              color={colors.green}
            />
          ))}
        {showResults &&
          results.random.map((result) => (
            <ResultRow
              key={result.id}
              result={result}
              handleResultPress={handleResultPress}
            />
          ))}
        {showResults && (
          <>
            {resultsHave.haveArtists && (
              <SeeAllBtn
                type="Artist"
                data={results.artists}
                handleSeeAll={handleSeeAll}
              />
            )}
            {resultsHave.haveTracks && (
              <SeeAllBtn
                type="Song"
                data={results.tracks}
                handleSeeAll={handleSeeAll}
              />
            )}
            {resultsHave.havePlaylists && (
              <SeeAllBtn
                type="Playlist"
                data={results.playlists}
                handleSeeAll={handleSeeAll}
              />
            )}
            {resultsHave.haveAlbums && (
              <SeeAllBtn
                type="Album"
                data={results.albums}
                handleSeeAll={handleSeeAll}
              />
            )}
          </>
        )}
        {showEmptyResult && <NoResults queryToShow={lastQuery} />}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkerGrey,
  },
  searchBarContainer: {
    backgroundColor: colors.darkerGrey,
    height: SEARCH_BAR_HEIGHT,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  searchIcon: {
    bottom: 0,
    marginLeft: 20,
    padding: 14,
    height: "100%",
    textAlignVertical: "center",
  },
  backBtnIcon: {
    marginLeft: 20,
    padding: 14,
    height: "100%",
    textAlignVertical: "center",
  },
  searchInput: {
    fontSize: 16,
    color: colors.white,
    height: "100%",
    marginLeft: 4,
    width: "70%",
    letterSpacing: 0.4,
    marginTop: 2,
  },
  clearIcon: {
    position: "absolute",
    padding: 11.5,
    height: "100%",
    textAlignVertical: "center",
    right: 0,
    paddingRight: 16,
  },
  scrollView: {
    backgroundColor: colors.background,
  },
  scrollContent: { flexGrow: 1 },
  indicator: {
    ...StyleSheet.absoluteFillObject,
  },
})

const mapStateToProps = (state: RootStoreType) => ({
  loading: state.searchReducer.queryLoading,
  results: state.searchReducer.results,
  resultsHave: state.searchReducer.resultsHave,
  queryEmpty: state.searchReducer.queryEmpty,
  lastQuery: state.searchReducer.lastQuery,
  queryHistory: state.searchReducer.queryHistory,
})

const mapDispatchToProps = {
  getQuery,
  querySave,
  queryDelete,
  queryDeleteAll,
  querySetSeeAll,
  setArtistId,
  getAlbumById,
  getPlaylistById,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(Search)
