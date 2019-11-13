import React from "react";
import Octicon from "react-native-vector-icons/Octicons";

const SearchIcon = (color: string) => (
  <Octicon style={{ bottom: 2.5 }} name="search" size={22} color={color} />
);
export default SearchIcon;
