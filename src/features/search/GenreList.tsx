import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";
import { genreImgList } from "../../data/assets/genres/genreImgList";
import { COLORS } from "../../utils";
import Animated, { Easing } from "react-native-reanimated";

const GenreCard = ({
  item,
  index,
  onPress,
}: {
  item: { name: string; id: string };
  index: number;
  onPress: (id: string) => void;
}) => {
  const scale = new Animated.Value(1);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={() =>
          Animated.timing(scale, {
            toValue: 0.96,
            duration: 100,
            easing: Easing.inOut(Easing.ease),
          }).start()
        }
        onPressOut={() =>
          Animated.timing(scale, {
            toValue: 1,
            duration: 100,
            easing: Easing.inOut(Easing.ease),
          }).start()
        }
        style={{ flexDirection: "row" }}
        onPress={() => onPress(item.id)}>
        <FastImage
          key={item.id}
          source={genreImgList[index].url}
          style={[styles.genreCard]}>
          <Text style={styles.genreText}>{item.name}</Text>
        </FastImage>
      </TouchableOpacity>
    </Animated.View>
  );
};

const GenreList = ({
  categoriesForCountry,
}: {
  categoriesForCountry: { name: string; id: string }[];
}) => {
  const onGenrePressed = (id: string) => {
    console.log(id);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.genreContainer}>
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
    width: 166,
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
