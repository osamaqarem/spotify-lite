import React, { useEffect } from "react";
import GenreList from "../components/Search/GenreList";
import { connect } from "react-redux";
import { getAllCategoriesForCountry } from "../redux/actions";

const SearchScreen = ({
  categoriesForCountry,
  getAllCategoriesForCountry,
}: {
  categoriesForCountry: { name: string; id: string }[];
  getAllCategoriesForCountry: () => void;
}) => {
  useEffect(() => {
    getAllCategoriesForCountry();
  }, []);
  return <GenreList categoriesForCountry={categoriesForCountry} />;
};

const mapStateToProps = (state: any) => ({
  categoriesForCountry: state.browseReducer.categoriesForCountry,
});

export default connect(
  mapStateToProps,
  { getAllCategoriesForCountry },
)(SearchScreen);
