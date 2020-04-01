import React from "react"
import { Text, View, StyleSheet } from "react-native"
import FastImage from "react-native-fast-image"
import Animated from "react-native-reanimated"
import { colors } from "../theme"

const DetailsCover = ({
  offsetY,
  artistName,
  name,
  imageUrl,
  coverShape,
  username,
}: {
  offsetY: Animated.Value<number>
  name: string | undefined
  artistName: string | null | undefined
  imageUrl: string | undefined
  coverShape: "CIRCLE" | "SQUARE"
  username: string | undefined
}) => {
  const scaleAnim = offsetY.interpolate({
    inputRange: [0, 250],
    outputRange: [1, 0.9],
    extrapolate: Animated.Extrapolate.CLAMP,
  })

  const opacityAnim = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  })

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scaleX: scaleAnim }, { scaleY: scaleAnim }],
        },
      ]}>
      <FastImage
        style={[
          styles.cover,
          { borderRadius: coverShape === "CIRCLE" ? 83 : 0 },
        ]}
        source={{ uri: imageUrl }}
      />
      <View style={styles.textContainer}>
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            {
              fontSize: name && name.length > 36 ? 12 : 18,
              marginTop: coverShape === "SQUARE" ? 0 : 10,
            },
          ]}>
          {name}
        </Text>
        {artistName && coverShape === "SQUARE" && (
          <Text style={styles.artist}>
            by {artistName === username ? "you" : artistName}
          </Text>
        )}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  cover: {
    height: 165,
    width: 165,
  },
  textContainer: { marginTop: 20, alignItems: "center" },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.6,
    textAlign: "center",
    marginHorizontal: 50,
  },
  artist: {
    marginTop: 5,
    color: colors.grey,
    fontSize: 14,
    letterSpacing: 0.6,
  },
})

export default DetailsCover
