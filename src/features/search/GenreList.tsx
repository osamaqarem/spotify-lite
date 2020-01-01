import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { COLORS } from "../../utils";
import GenreCard from "./GenreCard";

const GenreList = ({
  categoriesForCountry,
  onGenrePressed,
}: {
  categoriesForCountry: { name: string; id: string }[];
  onGenrePressed: (id: string) => void;
}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {categoriesForCountry.map((item, index) => (
          <GenreCard
            item={item}
            index={index}
            key={item.name}
            onPress={() => onGenrePressed(item.id)}
          />
        ))}
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
  scrollViewContent: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    paddingBottom: 16,
  },
});

export default GenreList;
