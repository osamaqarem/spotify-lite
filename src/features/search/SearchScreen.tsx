import React, { useEffect } from "react";
import GenreList from "./GenreList";
import { connect } from "react-redux";
import { getAllCategoriesForCountry } from "../../redux/actions";
import { View, StyleSheet } from "react-native";
import TopBarSearch from "./TopBarSearch";
import { CountryCategoryType } from "../../redux/reducers/browseReducer";
import { RootStoreType } from "../../redux/store";

const SearchScreen = ({
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
    <View style={styles.container}>
      <TopBarSearch />
      <GenreList categoriesForCountry={categoriesForCountry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

const mapStateToProps = (state: RootStoreType) => ({
  categoriesForCountry: state.browseReducer.categoriesForCountry,
});

export default connect(mapStateToProps, { getAllCategoriesForCountry })(
  SearchScreen,
);
