import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { NavigationEvents, SafeAreaView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../../../redux/reducers";
import { COLORS } from "../../../../utils/constants";
import { SEARCH_BAR_HEIGHT } from "../../components/TopBarSearch";
import BackBtnSearch from "../components/BackBtnSearch";
import ResultRow from "../components/ResultRow";
import {
  ResultKeyMap,
  ResultKey,
} from "../../../../redux/reducers/searchReducer";

type SeeAllType = { navigation: NavigationStackProp } & ReduxProps;

const SeeAll = ({ navigation, lastQuery, results, seeAllType }: SeeAllType) => {
  const handleWillFocus = () => {
    StatusBar.setBarStyle("light-content");
  };

  const items =
    seeAllType &&
    results[ResultKeyMap[seeAllType] as ResultKey].map(item => (
      <ResultRow
        result={item}
        key={item.id}
        handleResultPress={() => {
          return;
        }}
      />
    ));

  return (
    <SafeAreaView style={styles.container}>
      <NavigationEvents onWillFocus={handleWillFocus} />
      <View style={styles.bar}>
        <BackBtnSearch
          onPress={() => navigation.goBack()}
          tintColor={COLORS.lightGrey}
          textStyle={styles.backBtnIcon}
        />
        <Text style={styles.text}>{`"${lastQuery}"`} in Artists</Text>
        {items}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bar: {
    top: 0,
    left: 0,
    height: SEARCH_BAR_HEIGHT,
    backgroundColor: COLORS.tabBar,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.4,
    color: COLORS.white,
  },
  backBtnIcon: {
    position: "absolute",
    left: 0,
    paddingLeft: 34,
    backgroundColor: "red",
    padding: 14,
    height: "100%",
    textAlignVertical: "center",
  },
});

const mapStateToProps = (state: RootStoreType) => ({
  results: state.searchReducer.results,
  seeAllType: state.searchReducer.seeAllType,
  lastQuery: state.searchReducer.lastQuery,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(SeeAll);
