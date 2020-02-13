import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  EmitterSubscription,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { NavigationEvents, SafeAreaView, ScrollView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../../data/models/redux";
import { AlbumType } from "../../../data/models/spotify";
import { deleteQuery, saveQuery, searchForQuery } from "../../../redux/actions";
import { COLORS } from "../../../utils/constants";
import UIHelper from "../../../utils/helpers/UIHelper";
import SearchIcon from "../../navigation/components/navigators/bottom-tabs/icons/SearchIcon";
import { SEARCH_BAR_HEIGHT } from "../components/TopBarSearch";
import BackBtnSearch from "./components/BackBtnSearch";
import CancelBtn from "./components/CancelBtn";
import HistoryRow from "./components/HistoryRow";
import NoResults from "./components/NoResults";
import ResultRow from "./components/ResultRow";
import SearchIntro from "./components/SearchIntro";
import SeeAllBtn from "./components/SeeAllBtn";
import SearchHistory from "./components/SearchHistory";

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
}: SearchType) => {
  const [showBack, setShowBack] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (results && loading) {
      results.random = [];
    }
  }, [loading, results]);

  const handleResultPress = (item: AlbumType) => {
    saveQuery(item);
  };

  const handleRemove = (item: AlbumType) => {
    deleteQuery(item);
  };

  const showLoading = query.length > 0 && loading;
  const showResults = results.random.length > 0;
  const showEmptyResult = queryEmpty && lastQuery.length > 0;
  const normalState = !showResults && !loading && !showEmptyResult;
  const showHistory = queryHistory.length > 0 && normalState;
  const showIntro = !showHistory && normalState;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.darkerGrey,
      }}>
      <NavigationEvents
        onWillFocus={() => StatusBar.setBarStyle("light-content")}
        onDidFocus={() => {
          keyboardWillHideListener = Keyboard.addListener(
            "keyboardWillHide",
            () => setShowBack(false),
          );
        }}
        onWillBlur={() => keyboardWillHideListener.remove()}
      />
      <View
        style={{
          backgroundColor: COLORS.darkerGrey,
          height: SEARCH_BAR_HEIGHT,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}>
        <>
          {(!showBack && (
            <SearchIcon
              tintColor={COLORS.lightGrey}
              textStyle={{
                bottom: 0,
                marginLeft: 20,
                padding: 14,
                height: "100%",
                textAlignVertical: "center",
              }}
            />
          )) || (
            <BackBtnSearch
              onPress={() => navigation.goBack()}
              tintColor={COLORS.lightGrey}
              textStyle={{
                marginLeft: 20,
                padding: 14,
                height: "100%",
                textAlignVertical: "center",
              }}
            />
          )}
        </>
        <TextInput
          autoFocus
          numberOfLines={1}
          value={query}
          onChangeText={text => {
            setQuery(text);
            searchForQuery(text);
          }}
          onFocus={() => setShowBack(true)}
          placeholder="Search artists, songs and playlists"
          placeholderTextColor={COLORS.darkGrey}
          selectionColor={COLORS.white}
          style={{
            fontSize: 16,
            color: COLORS.white,
            height: "100%",
            marginLeft: 4,
            width: "70%",
            letterSpacing: 0.4,
            marginTop: 2,
          }}
        />
        {showBack && query.length > 0 && (
          <CancelBtn
            size={28}
            color={COLORS.lightGrey}
            handlePress={() => {
              searchForQuery("");
              setQuery("");
              setShowBack(false);
              Keyboard.dismiss();
            }}
            iconStyle={{
              position: "absolute",
              padding: 11.5,
              height: "100%",
              textAlignVertical: "center",
              right: 0,
              paddingRight: 16,
            }}
          />
        )}
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: COLORS.background,
        }}>
        {showHistory && (
          <SearchHistory
            queryHistory={queryHistory}
            handleRemove={handleRemove}
          />
        )}
        {(showIntro && <SearchIntro />) ||
          (showLoading && (
            <ActivityIndicator
              style={{
                ...StyleSheet.absoluteFillObject,
              }}
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
            {resultsHave.haveArtists && <SeeAllBtn type="Artist" />}
            {resultsHave.haveTracks && <SeeAllBtn type="Song" />}
            {resultsHave.havePlaylists && <SeeAllBtn type="Playlist" />}
            {resultsHave.haveAlbums && <SeeAllBtn type="Album" />}
          </>
        )}
        {showEmptyResult && <NoResults queryToShow={lastQuery} />}
      </ScrollView>
    </SafeAreaView>
  );
};

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
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Search);
