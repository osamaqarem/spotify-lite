import React from "react"
import { SafeAreaView, StyleSheet, ToastAndroid, View } from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../theme"
import DotsView from "./DotsView"
import BackBtn from "./BackBtn"

export const HEADER_HEIGHT = 42

interface Props {
  goBack: () => void
  isLoading: boolean
}

const PlaylistHeaderControl = ({ goBack, isLoading }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <BackBtn goBack={goBack} />
      {!isLoading && (
        <>
          <View style={styles.heartContainer}>
            <Icon
              onPress={() => {
                ToastAndroid.show("Heart!", ToastAndroid.SHORT)
              }}
              name={true ? "heart" : "heart-outline"}
              size={26}
              style={styles.heart}
            />
          </View>
          <View style={styles.dotsContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                ToastAndroid.show("Dots!", ToastAndroid.SHORT)
              }}>
              <DotsView color={colors.white} />
            </TouchableWithoutFeedback>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    top: 0,
    height: HEADER_HEIGHT,
  },
  heartContainer: {
    position: "absolute",
    right: 50,
    top: 6,
    height: HEADER_HEIGHT,
    width: HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    color: colors.green,
  },
  dotsContainer: {
    position: "absolute",
    right: 9,
    top: 6,
    height: HEADER_HEIGHT,
    width: HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default PlaylistHeaderControl
