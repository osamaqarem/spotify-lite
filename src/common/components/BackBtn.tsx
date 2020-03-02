import React from "react"
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors, dimensions } from "../theme"
import { HEADER_HEIGHT } from "./PlaylistHeaderControl"

export const BACKBTN_HEIGHT = 80 * dimensions.widthRatio

const BackBtn = ({
  goBack,
  viewStyle,
  textStyle,
}: {
  goBack: () => void
  viewStyle?: ViewStyle
  textStyle?: TextStyle
}) => {
  return (
    <View style={[styles.backContainer, viewStyle]}>
      <Icon
        onPress={goBack}
        name="arrow-left"
        size={28}
        style={[
          {
            color: colors.white,
            textAlign: "center",
            textAlignVertical: "center",
          },
          textStyle,
        ]}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  backContainer: {
    position: "absolute",
    left: 14,
    top: 10,
    height: HEADER_HEIGHT,
    width: HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default BackBtn
