import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import Animated, { Easing } from "react-native-reanimated";
import { genreImgList } from "../../data/assets/genres/genreImgList";
import { COLORS } from "../../utils";

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

const styles = StyleSheet.create({
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

export default GenreCard;
