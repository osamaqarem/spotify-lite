import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  EmitterSubscription,
  Keyboard,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { NavigationEvents, SafeAreaView, ScrollView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../../data/models/redux";
import { searchForQuery } from "../../../redux/actions";
import { COLORS } from "../../../utils/constants";
import SearchIcon from "../../navigation/components/navigators/bottom-tabs/icons/SearchIcon";
import { SEARCH_BAR_HEIGHT } from "../components/TopBarSearch";
import BackBtnSearch from "./components/BackBtnSearch";
import NoResults from "./components/NoResults";
import ResultRow from "./components/ResultRow";
import SearchIntro from "./components/SearchIntro";
import SeeAllBtn from "./components/SeeAllBtn";

type SearchType = { navigation: NavigationStackProp } & ReduxProps;

let keyboardWillHideListener: EmitterSubscription;

const Search = ({
  navigation,
  searchForQuery,
  loading,
  queryEmpty,
  lastQuery,
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

  const showLoading = query.length > 0 && loading;
  const showResults = results.random.length > 0;
  const showNoResults = queryEmpty && lastQuery.length > 0;
  const showIntro = !showResults && !loading && !showNoResults;

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
          <MaterialIcon
            onPress={() => {
              // if (query.length > 0) {
              searchForQuery("");
              setQuery("");
              // }
              setShowBack(false);
              Keyboard.dismiss();
            }}
            style={{
              position: "absolute",
              padding: 11.5,
              height: "100%",
              textAlignVertical: "center",
              right: 0,
              paddingRight: 16,
            }}
            name="close"
            size={28}
            color={COLORS.lightGrey}
          />
        )}
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{
          backgroundColor: COLORS.background,
        }}>
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
            <ResultRow key={result.id} result={result} />
          ))}
        {showResults && (
          <>
            {resultsHave.haveArtists && <SeeAllBtn type="Artist" />}
            {resultsHave.haveTracks && <SeeAllBtn type="Song" />}
            {resultsHave.havePlaylists && <SeeAllBtn type="Playlist" />}
            {resultsHave.haveAlbums && <SeeAllBtn type="Album" />}
          </>
        )}
        {showNoResults && <NoResults queryToShow={lastQuery} />}
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
});

const mapDispatchToProps = {
  searchForQuery,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Search);
