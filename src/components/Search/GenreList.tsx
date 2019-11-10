import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { searchIcon } from "../common/TabBar";
import { COLORS } from "../../utils";
import FastImage from "react-native-fast-image";

const data = [
  {
    url: require("../../data/assets/genres/0.png"),
  },
  {
    url: require("../../data/assets/genres/1.png"),
  },
  {
    url: require("../../data/assets/genres/2.png"),
  },
  {
    url: require("../../data/assets/genres/3.png"),
  },
  {
    url: require("../../data/assets/genres/4.png"),
  },
  {
    url: require("../../data/assets/genres/5.png"),
  },
  {
    url: require("../../data/assets/genres/6.png"),
  },
  {
    url: require("../../data/assets/genres/7.png"),
  },
  {
    url: require("../../data/assets/genres/8.png"),
  },
  {
    url: require("../../data/assets/genres/9.png"),
  },
];

const renderCard = (item: { name: string; id: string }, index: number) => {
  return (
    <FastImage
      source={
        index < 10 ? data[index].url : require("../../data/assets/genres/9.png")
      }
      style={styles.genreCard}>
      <Text style={styles.genreText}>{item.name}</Text>
    </FastImage>
  );
};

const TopBarSearch = () => (
  <View style={styles.topBarContainer}>
    <View style={styles.searchIconContainer}>{searchIcon("#000")}</View>
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
        }}>
        Search artists, songs and playlists
      </Text>
    </View>
  </View>
);

const GenreList = ({
  categoriesForCountry,
}: {
  categoriesForCountry: { name: string; id: string }[];
}) => {
  return (
    <View style={styles.container}>
      <TopBarSearch />
      <View style={styles.genreParentContainer}>
        <View style={styles.genreContainer}>
          {categoriesForCountry.map((item, index) => renderCard(item, index))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBarContainer: {
    top: 0,
    left: 0,
    height: 60,
    backgroundColor: COLORS.tabSearch,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  searchIconContainer: { marginRight: 20, marginTop: 5 },
  genreParentContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: "100%",
  },
  genreContainer: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  genreCard: {
    backgroundColor: "crimson",
    height: 100,
    width: "42.5%",
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  genreText: {
    fontSize: 16,
    color: COLORS.textLight,
    top: 10,
    left: 10,
    fontWeight: "bold",
  },
});

export default GenreList;
