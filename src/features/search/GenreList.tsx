import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { COLORS } from "../../utils";
import GenreCard from "./GenreCard";

const GenreList = ({
  categoriesForCountry,
}: {
  categoriesForCountry: { name: string; id: string }[];
}) => {
  const onGenrePressed = (id: string) => {
    // todo: get genre by id
    // navigate to genre screen
    console.log(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {categoriesForCountry.map((item, index) => (
          <GenreCard
            item={item}
            index={index}
            key={item.name}
            onPress={onGenrePressed}
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
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingBottom: 16,
  },
});

export default GenreList;
