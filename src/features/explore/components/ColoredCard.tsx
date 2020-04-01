import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated, { Easing } from "react-native-reanimated"
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg"

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
        <View style={styles.genreCard}>
          <Card name={item.name} index={index} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  genreCard: {
    height: 76,
    width: 154,
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  genreText: {
    fontSize: 16,
    color: "white",
    top: 26,
    left: 10,
    fontWeight: "bold",
  },
})

const Card = ({ name, index }: { name: string; index: number }) => {
  return (
    <Svg width={154} height={76} viewBox="0 0 154 76" fill="none">
      <Rect width={154} height={76} rx={4} fill="url(#prefix__paint0_linear)" />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={236}
          y1={0}
          x2={236}
          y2={266}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor={shuffledColors[index][0]} />
          <Stop offset={0.842} stopColor={shuffledColors[index][1]} />
        </LinearGradient>
        <Text style={styles.genreText}>{name}</Text>
      </Defs>
    </Svg>
  )
}

const cardColors = [
  ["#DB4A36", "#6C5742"],
  ["#4DA4E9", "#B8E9CB"],
  ["#54A9E9", "#AFE3CD"],
  ["#655B73", "#8798AA"],
  ["#9E3339", "#D28250"],
  ["#C9D66C", "#BA7084"],
  ["#3A52BC", "#708FC7"],
  ["#36577D", "#7FC5C5"],
  ["#52A9E9", "#A8DED0"],
  ["#EB509C", "#DBA67E"],
  ["#E745AA", "#CD71B8"],
  ["#4B3752", "#30335D"],
  ["#3545D5", "#24A8A9"],
  ["#FF980D", "#FEB344"],
  ["#BB429F", "#DD87B8"],
  ["#3F3370", "#913488"],
  ["#324975", "#6582A0"],
  ["#363ED8", "#23A8A9"],
  ["#6BA2EF", "#B2B7E1"],
  ["#404875", "#9B89A1"],
  ["#344273", "#716B9B"],
]

const shuffledColors = cardColors.sort(() => 0.5 - Math.random())

export default ColoredCard
