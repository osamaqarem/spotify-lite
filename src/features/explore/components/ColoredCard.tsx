import React from "react"
import { Text, TouchableOpacity, StyleSheet } from "react-native"
import FastImage from "react-native-fast-image"
import Animated, { Easing } from "react-native-reanimated"
import { genreImages } from "../../../common/theme/genreImages"
import { colors } from "../../../common/theme"

const ColoredCard = ({
  item,
  index,
  onPress,
}: {
  item: { name: string; id: string }
  index: number
  onPress: (id: string) => void
}) => {
  const scale = new Animated.Value(1)

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
          source={genreImages[index].url}
          style={[styles.genreCard]}>
          <Text style={styles.genreText}>{item.name}</Text>
        </FastImage>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  genreCard: {
    backgroundColor: "crimson",
    height: 76,
    width: 154,
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  genreText: {
    fontSize: 16,
    color: colors.white,
    top: 26,
    left: 10,
    fontWeight: "bold",
  },
})

export default ColoredCard
