import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { genreImgList } from "../../data/assets/genres/genreImgList";
import { COLORS } from "../../utils";

const renderCard = (item: { name: string; id: string }, index: number) => {
  return (
    <FastImage
      key={index}
      source={genreImgList[index].url}
      style={styles.genreCard}>
      <Text style={styles.genreText}>{item.name}</Text>
    </FastImage>
  );
};

const GenreList = ({
  categoriesForCountry,
}: {
  categoriesForCountry: { name: string; id: string }[];
}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.genreContainer}>
        {categoriesForCountry.map((item, index) => renderCard(item, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: "100%",
  },
  genreContainer: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingBottom: 16,
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
    color: COLORS.white,
    top: 10,
    left: 10,
    fontWeight: "bold",
  },
});

export default GenreList;
