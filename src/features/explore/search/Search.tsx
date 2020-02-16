import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  EmitterSubscription,
  Keyboard,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { NavigationEvents, SafeAreaView, ScrollView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../../data/models/redux";
import { AlbumType } from "../../../data/models/spotify";
import {
  clearAllSearches,
  deleteQuery,
  saveQuery,
  searchForQuery,
  setSeeAll,
} from "../../../redux/actions";
import { COLORS, Routes } from "../../../utils/constants";
import SearchIcon from "../../navigation/components/navigators/bottom-tabs/icons/SearchIcon";
import { SEARCH_BAR_HEIGHT } from "../components/TopBarSearch";
import BackBtnSearch from "./components/BackBtnSearch";
import CrossIcon from "../../../components/CrossIcon";
import NoResults from "./components/NoResults";
import ResultRow from "./components/ResultRow";
import SearchHistory from "./components/SearchHistory";
import SearchIntro from "./components/SearchIntro";
import SeeAllBtn from "./components/SeeAllBtn";

type SearchType = { navigation: NavigationStackProp } & ReduxProps;

let keyboardWillHideListener: EmitterSubscription;

const Search = ({
  navigation,
  searchForQuery,
  saveQuery,
  deleteQuery,
  loading,
  queryEmpty,
  lastQuery,
  queryHistory,
  results,
  resultsHave,
  clearAllSearches,
  setSeeAllType,
}: SearchType) => {
  const [showBack, setShowBack] = useState(false);
  const [query, setQuery] = useState("");
  const searchInput = useRef<TextInput>(null);

  useEffect(() => {
    if (results && loading) {
      results.random = [];
    }
  }, [loading, results]);

  const handleWillFocus = () => {
    StatusBar.setBarStyle("light-content");
  };

  const handleDidFocus = () => {
    keyboardWillHideListener = Keyboard.addListener("keyboardWillHide", () =>
      setShowBack(false),
    );
  };

  const handleWillBlur = () => {
    keyboardWillHideListener && keyboardWillHideListener.remove();
  };

  const handleInputFocus = () => {
    setShowBack(true);
  };

  const handleQuery = (text: string) => {
    setQuery(text);
    searchForQuery(text);
  };

  const handleClear = () => {
    searchForQuery("");
    setQuery("");
    setShowBack(false);
    Keyboard.dismiss();
  };

  const handleResultPress = (item: AlbumType) => {
    saveQuery(item);
  };

  const handleRemove = (item: AlbumType) => {
    deleteQuery(item);
  };

  const handleclearAll = () => {
    clearAllSearches();
    searchInput.current?.focus();
  };

  const handleSeeAll = (data: AlbumType[]) => {
    setSeeAllType(data);
    navigation.navigate(Routes.BottomTabs.ExploreStack.SeeAll);
  };

  const showLoading = query.length > 0 && loading;
  const showResults = results.random.length > 0;
  const showEmptyResult = queryEmpty && lastQuery.length > 0;
  const normalState = !showResults && !loading && !showEmptyResult;
  const showHistory = queryHistory.length > 0 && normalState;
  const showIntro = !showHistory && normalState;

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
              tintColor={COLORS.lightGrey}
              textStyle={styles.searchIcon}
            />
          )) || (
            <BackBtnSearch
              onPress={() => navigation.goBack()}
              tintColor={COLORS.lightGrey}
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
          placeholderTextColor={COLORS.darkGrey}
          selectionColor={COLORS.white}
          style={styles.searchInput}
        />
        {showBack && query.length > 0 && (
          <CrossIcon
            size={28}
            color={COLORS.lightGrey}
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
          />
        )}
        {(showIntro && <SearchIntro />) ||
          (showLoading && (
            <ActivityIndicator
              style={styles.indicator}
              size={50}
              color={COLORS.green}
            />
          ))}
        {showResults &&
          results.random.map(result => (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkerGrey,
  },
  searchBarContainer: {
    backgroundColor: COLORS.darkerGrey,
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
    color: COLORS.white,
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
    backgroundColor: COLORS.background,
  },
  scrollContent: { flexGrow: 1 },
  indicator: {
    ...StyleSheet.absoluteFillObject,
  },
});

const mapStateToProps = (state: RootStoreType) => ({
  loading: state.searchReducer.queryLoading,
  results: state.searchReducer.results,
  resultsHave: state.searchReducer.resultsHave,
  queryEmpty: state.searchReducer.queryEmpty,
  lastQuery: state.searchReducer.lastQuery,
  queryHistory: state.searchReducer.queryHistory,
});

const mapDispatchToProps = {
  searchForQuery,
  saveQuery,
  deleteQuery,
  clearAllSearches,
  setSeeAllType: setSeeAll,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Search);
