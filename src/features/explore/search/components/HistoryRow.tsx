import React from "react"
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import FastImage from "react-native-fast-image"
import Animated, { Easing } from "react-native-reanimated"
import { AlbumType } from "../../../../services/network/models/spotify/SpotifyCommon"
import { colors } from "../../../../common/theme"
import UIHelper from "../../../../common/helpers/UIHelper"
import CrossIcon from "../../../../common/components/CrossIcon"
import { MARGIN_HORIZONTAL } from "./ResultRow"

export const ROW_HEIGHT = 67

const HistoryRow = ({
  item,
  handleRemove,
  handleResultPress,
}: {
  item: AlbumType
  handleRemove: (item: AlbumType) => void
  handleResultPress: (item: AlbumType) => void
}) => {
  const scale = new Animated.Value(1)
  const opacity = new Animated.Value(1)

  const onRemove = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 65,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      setTimeout(() => {
        LayoutAnimation.configureNext({
          duration: 100,
          update: {
            type: LayoutAnimation.Types.linear,
          },
        })
        handleRemove(item)
      }, 10)
    })
  }

  const handlePress = () => {
    handleResultPress(item)
  }

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity
        style={styles.itemBtn}
        onPressIn={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.in).start()
        }
        onPressOut={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.out).start()
        }
        onPress={handlePress}>
        <Animated.View
          style={[
            styles.item,
            {
              transform: [{ scale }],
            },
          ]}>
          <FastImage
            source={{
              uri: item.imageURL || "",
            }}
            style={[
              styles.cover,
              { borderRadius: item.type === "Artist" ? 27 : 0 },
            ]}
          />
          <View style={styles.itemInfoContainer}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={styles.type}>
              {item.type}
              {item.type === "Song" ? " • " + item.artist : null}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
      <CrossIcon
        size={30}
        color={colors.darkerGrey}
        handlePress={onRemove}
        iconStyle={styles.removeIcon}
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    height: ROW_HEIGHT,
  },
  itemBtn: {
    width: "86%",
    alignSelf: "flex-start",
  },
  item: {
    marginHorizontal: MARGIN_HORIZONTAL,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 3,
    width: "100%",
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
  removeIcon: {
    padding: 11.5,
    textAlignVertical: "center",
    top: 4,
    left: 2,
  },
})

export default HistoryRow
