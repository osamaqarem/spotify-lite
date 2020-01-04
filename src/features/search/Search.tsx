import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationEvents, SafeAreaView } from "react-navigation";
import { connect, ConnectedProps } from "react-redux";
import {
  getAllCategoriesForCountry,
  getCategoryById,
} from "../../redux/actions";
import { RootStoreType } from "../../redux/reducers";
import { COLORS, Routes } from "../../utils";
import GenreList from "./GenreList";
import TopBarSearch from "./TopBarSearch";
import { NavigationStackProp } from "react-navigation-stack";

const Search = ({
  categoriesForCountry,
  getAllCategoriesForCountry,
  getCategoryById,
  navigation,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  useEffect(() => {
    getAllCategoriesForCountry();
  }, [getAllCategoriesForCountry]);

  const onGenrePressed = (id: string) => {
    getCategoryById(id);
    navigation.navigate(Routes.AppTabs.SearchStack.Genre);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle("dark-content");
        }}
      />
      <View style={styles.container}>
        <TopBarSearch />
        <GenreList
          categoriesForCountry={categoriesForCountry}
          onGenrePressed={onGenrePressed}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

const mapStateToProps = (state: RootStoreType) => ({
  categoriesForCountry: state.browseReducer.categoriesForCountry,
});

const mapDispatchToPros = {
  getAllCategoriesForCountry,
  getCategoryById,
};

const connector = connect(mapStateToProps, mapDispatchToPros);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Search);
