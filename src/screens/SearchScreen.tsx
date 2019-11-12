import React, { useEffect } from "react";
import GenreList from "../components/Search/GenreList";
import { connect } from "react-redux";
import { getAllCategoriesForCountry } from "../redux/actions";
import { View, StyleSheet } from "react-native";
import TopBarSearch from "../components/Search/TopBarSearch";

const SearchScreen = ({
  categoriesForCountry,
  getAllCategoriesForCountry,
}: {
  categoriesForCountry: { name: string; id: string }[];
  getAllCategoriesForCountry: () => void;
}) => {
  useEffect(() => {
    getAllCategoriesForCountry();
  }, [getAllCategoriesForCountry]);

  return (
    <View style={styles.container}>
      <GenreList categoriesForCountry={categoriesForCountry} />
      <TopBarSearch />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});

const mapStateToProps = (state: any) => ({
  categoriesForCountry: state.browseReducer.categoriesForCountry,
});

export default connect(mapStateToProps, { getAllCategoriesForCountry })(
  SearchScreen,
);
