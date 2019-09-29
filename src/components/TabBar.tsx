import React from "react";
import {StyleSheet, Text, TextStyle} from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Octicon from "react-native-vector-icons/Octicons";
import {COLORS} from "../utils/_vars";

const sizes = {
  home: 24.5,
  search: 22,
  favorites: 25,
};

const styles = StyleSheet.create({
  marginHome: {
    bottom: 6,
  },
  marginSearch: {
    bottom: 2.5,
  },
  marginFavorites: {
    bottom: 6,
  },
  labelStyle: {
    fontSize: 10,
  },
});

export const homeIcon = (color: string) => {
  if (color === COLORS.icon) {
    return (
      <MaterialCommunityIcon
        style={styles.marginHome}
        name="home-outline"
        size={sizes.home}
        color={color}
      />
    );
  } else {
    return (
      <MaterialCommunityIcon
        style={[styles.marginHome]}
        name="home-variant"
        size={sizes.home}
        color={color}
      />
    );
  }
};

export const searchIcon = (color: string) => (
  <Octicon
    style={styles.marginSearch}
    name="search"
    size={sizes.search}
    color={color}
  />
);

export const favoritesIcon = (color: string) => {
  if (color === COLORS.icon) {
    return (
      <MaterialCommunityIcon
        style={styles.marginFavorites}
        name="heart-outline"
        size={sizes.favorites}
        color={color}
      />
    );
  } else {
    return (
      <MaterialCommunityIcon
        style={styles.marginFavorites}
        name="heart"
        size={sizes.favorites}
        color={color}
      />
    );
  }
};

export const HomeLabel = <Text style={styles.labelStyle}>Home</Text>;
export const SearchLabel = <Text style={styles.labelStyle}>Search</Text>;
export const FavoritesLabel = <Text style={styles.labelStyle}>Favorites</Text>;
