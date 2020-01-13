import React from "react";
import Octicon from "react-native-vector-icons/Octicons";

const SearchIcon = ({ tintColor }: { tintColor: string }) => {
  return (
    <Octicon
      style={{ bottom: 2.5 }}
      name="search"
      size={22}
      color={tintColor}
    />
  );
};

export default SearchIcon;
