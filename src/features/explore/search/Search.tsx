import React, { useState, useEffect } from "react";
import {
  EmitterSubscription,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  StyleSheet,
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
import SearchIntro from "./components/SearchIntro";
import FastImage from "react-native-fast-image";
import { AlbumType } from "../../../data/models/spotify";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

type SearchType = { navigation: NavigationStackProp } & ReduxProps;

let keyboardWillHideListener: EmitterSubscription;

const ResultRow = ({ result }: { result: AlbumType }) => {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 3,
      }}>
      <FastImage
        source={{
          uri: result.imageURL || "",
        }}
        style={{
          height: 54,
          width: 54,
        }}
      />
      <View
        style={{
          flexDirection: "column",
          marginHorizontal: 12,
          maxWidth: "80%",
          marginTop: 2,
        }}>
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: COLORS.darkWhite,
            letterSpacing: 0.8,
            fontSize: 16,
          }}>
          {result.name}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            fontWeight: "normal",
            color: COLORS.grey,
            letterSpacing: 0.8,
            fontSize: 14,
          }}>
          {result.type}
          {result.type === "Song" ? " • " + result.owner : null}
        </Text>
      </View>
    </View>
  );
};

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
  const showIntro = !showResults && !loading;
  const showNoResults =
    !showIntro && !showResults && queryEmpty && lastQuery.length > 0;

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
        {showBack && (
          <MaterialIcon
            onPress={() => {
              setQuery("");
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
        style={{
          backgroundColor: COLORS.background,
        }}
        contentContainerStyle={{
          flex: 1,
          marginHorizontal: 14,
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
        {showNoResults && <NoResults queryToShow={lastQuery} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const NoResults = ({ queryToShow }: { queryToShow: string }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <MaterialCommunityIcon
        style={{
          marginBottom: 26,
        }}
        name="flag-outline"
        size={64}
        color={COLORS.white}
      />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
          color: COLORS.white,
          letterSpacing: 0.3,
          textAlign: "center",
          lineHeight: 22,
          maxWidth: "70%",
        }}>
        No results found for {`\'${queryToShow}\'`}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: COLORS.grey,
          marginTop: 22,
          textAlign: "center",
          maxWidth: "70%",
          lineHeight: 20,
        }}>
        Please check you have the right spelling, or try different keywords.
      </Text>
    </View>
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
