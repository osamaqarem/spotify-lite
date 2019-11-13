import React, { useEffect } from "react";
import GenreList from "../components/Search/GenreList";
import { connect } from "react-redux";
import { getAllCategoriesForCountry } from "../redux/actions";
import { View, StyleSheet } from "react-native";
import TopBarSearch from "../components/Search/TopBarSearch";
import { ReduxStoreType } from "../redux/reducers";
import { CountryCategoryType } from "../redux/reducers/browseReducer";

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

const mapStateToProps = (state: ReduxStoreType) => ({
  categoriesForCountry: state.browseReducer.categoriesForCountry,
});

export default connect(mapStateToProps, { getAllCategoriesForCountry })(
  SearchScreen,
);
