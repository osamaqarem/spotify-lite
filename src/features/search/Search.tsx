import React, { useEffect } from "react";
import GenreList from "./GenreList";
import { connect } from "react-redux";
import { getAllCategoriesForCountry } from "../../redux/actions";
import { View, StyleSheet, StatusBar } from "react-native";
import TopBarSearch from "./TopBarSearch";
import { CountryCategoryType } from "../../redux/reducers/browseReducer";
import { RootStoreType } from "../../redux/store";
import { SafeAreaView, NavigationEvents } from "react-navigation";
import { COLORS } from "../../utils";

const Search = ({
  categoriesForCountry,
  getAllCategoriesForCountry,
}: {
  categoriesForCountry: CountryCategoryType[];
  getAllCategoriesForCountry: () => void;
}) => {
  useEffect(() => {
    getAllCategoriesForCountry();
  }, [getAllCategoriesForCountry]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <NavigationEvents
        onDidFocus={() => {
          StatusBar.setBarStyle("dark-content");
        }}
      />
      <View style={styles.container}>
        <TopBarSearch />
        <GenreList categoriesForCountry={categoriesForCountry} />
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

export default connect(mapStateToProps, { getAllCategoriesForCountry })(Search);
