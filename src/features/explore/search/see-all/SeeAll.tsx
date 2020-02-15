import React from "react";
import { StatusBar, StyleSheet, Text, View, ScrollView } from "react-native";
import { NavigationEvents, SafeAreaView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../../../redux/reducers";
import { COLORS } from "../../../../utils/constants";
import { SEARCH_BAR_HEIGHT } from "../../components/TopBarSearch";
import BackBtnSearch from "../components/BackBtnSearch";
import ResultRow from "../components/ResultRow";

type SeeAllType = { navigation: NavigationStackProp } & ReduxProps;

const SeeAll = ({ navigation, lastQuery, seeAll }: SeeAllType) => {
  const handleWillFocus = () => {
    StatusBar.setBarStyle("light-content");
  };

  const items = seeAll.data.map(item => (
    <ResultRow
      containerStyle={{ marginTop: 14 }}
      coverStyle={{ height: 44, width: 44 }}
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
        <Text style={styles.text}>
          {`"${lastQuery}"`} in {seeAll.type}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 4 }}>
        {items}
      </ScrollView>
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
    marginTop: 4,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.8,
    color: COLORS.white,
  },
  backBtnIcon: {
    position: "absolute",
    left: 0,
    paddingLeft: 34,
    padding: 14,
    height: "100%",
    textAlignVertical: "center",
  },
});

const mapStateToProps = (state: RootStoreType) => ({
  seeAll: state.searchReducer.seeAll,
  lastQuery: state.searchReducer.lastQuery,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(SeeAll);
