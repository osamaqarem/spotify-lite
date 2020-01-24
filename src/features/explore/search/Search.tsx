import React, { useState } from "react";
import {
  EmitterSubscription,
  Keyboard,
  StatusBar,
  TextInput,
  View,
  KeyboardAvoidingView,
} from "react-native";
import Octicon from "react-native-vector-icons/Octicons";
import { NavigationEvents, SafeAreaView, ScrollView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { searchForQuery } from "../../../redux/actions";
import { RootStoreType } from "../../../redux/types";
import { COLORS } from "../../../utils";
import SearchIcon from "../../navigation/components/navigators/bottom-tabs/icons/SearchIcon";
import { SEARCH_BAR_HEIGHT } from "../components/TopBarSearch";
import BackBtnSearch from "./components/BackBtnSearch";
import SearchIntro from "./components/SearchIntro";

/**
 *
 * TODO:
 * 1- Each results has up to 20 items. Show maximum of 7 items.
 * 2- At the bottom, if more artists exist show 'Show all artists'
 * 3- Do #2 for playlists, tracks and albums.
 * 4- Create an array randomly from results
 *
 * 5- Render a list that contains items. each item will have
 * a type (album, artist, playlist, track) to determine where
 * to navigate onClick.
 *
 */

type SearchType = { navigation: NavigationStackProp } & ReduxProps;

let keyboardWillHideListener: EmitterSubscription;

const Search = ({ navigation, searchForQuery }: SearchType) => {
  const [showBack, setShowBack] = useState(false);
  const [query, setQuery] = useState("");

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
          width: "100%",
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
                marginLeft: 20,
                bottom: 0,
                padding: 14,
              }}
            />
          )) || (
            <BackBtnSearch
              onPress={() => navigation.goBack()}
              tintColor={COLORS.lightGrey}
              textStyle={{
                marginLeft: 20,
                padding: 11.5,
              }}
            />
          )}
        </>
        <TextInput
          value={query}
          onChangeText={text => {
            setQuery(text);
            searchForQuery(`"${text}"`);
          }}
          autoFocus
          onFocus={() => setShowBack(true)}
          placeholder="Search artists, songs and playlists"
          placeholderTextColor={COLORS.darkGrey}
          selectionColor={COLORS.white}
          style={{
            fontSize: 16,
            color: COLORS.white,
            marginLeft: 16,
            letterSpacing: 0.3,
            maxWidth: 260,
          }}
        />
        {showBack && (
          <Octicon
            onPress={() => {
              setQuery("");
              setShowBack(false);
              Keyboard.dismiss();
            }}
            style={{
              position: "absolute",
              padding: 10,
              top: 0,
              bottom: 0,
              marginTop: 5,
              right: 12,
            }}
            name="x"
            size={24}
            color={COLORS.lightGrey}
          />
        )}
      </View>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: COLORS.background,
        }}>
        <KeyboardAvoidingView keyboardVerticalOffset={400} behavior="position">
          {true && <SearchIntro />}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootStoreType) => ({});

const mapDispatchToProps = {
  searchForQuery,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Search);
