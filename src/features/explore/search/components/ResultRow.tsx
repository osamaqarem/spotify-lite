import React from "react"
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
} from "react-native"
import FastImage, { ImageStyle } from "react-native-fast-image"
import Animated from "react-native-reanimated"
import { AlbumType } from "../../../../services/network/models/spotify/SpotifyCommon"
import UIHelper from "../../../../common/helpers/UIHelper"
import { colors } from "../../../../common/theme"

export const MARGIN_HORIZONTAL = 14

const clock = new Animated.Clock()
const opacityAnim = UIHelper.runTiming(clock, 0, 1, 500)

const ResultRow = React.memo(
  ({
    result,
    handleResultPress,
    coverStyle,
    containerStyle,
  }: {
    result: AlbumType
    handleResultPress: (item: AlbumType) => void
    coverStyle?: ImageStyle
    containerStyle?: ViewStyle
  }) => {
    const scale = new Animated.Value(1)

    return (
      <TouchableOpacity
        onPressIn={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.in).start()
        }
        onPressOut={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.out).start()
        }
        onPress={() => {
          handleResultPress(result)
        }}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale }],
            },
            containerStyle,
          ]}>
          <FastImage
            source={{
              uri: result.imageURL || "",
            }}
            style={[
              styles.cover,
              {
                borderRadius: result.type === "Artist" ? 27 : 0,
              },
              coverStyle,
            ]}
          />
          <View style={styles.itemInfoContainer}>
            <Text numberOfLines={1} style={styles.name}>
              {result.name}
            </Text>
            <Text numberOfLines={1} style={styles.type}>
              {result.type}
              {result.type === "Song" ? " • " + result.artist : null}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  },
)

ResultRow.displayName = "ResultRow"

const styles = StyleSheet.create({
  container: {
    marginHorizontal: MARGIN_HORIZONTAL,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 3,
  },
  cover: {
    height: 54,
    width: 54,
  },
  itemInfoContainer: {
    flexDirection: "column",
    marginHorizontal: 12,
    maxWidth: "80%",
    marginTop: 2,
  },
  name: {
    flex: 1,
    color: colors.darkWhite,
    letterSpacing: 0.8,
    fontSize: 16,
  },
  type: {
    flex: 1,
    fontWeight: "normal",
    color: colors.grey,
    letterSpacing: 0.8,
    fontSize: 14,
  },
})

export default ResultRow
