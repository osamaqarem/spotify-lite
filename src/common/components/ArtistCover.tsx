import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import FastImage from "react-native-fast-image"
import Animated from "react-native-reanimated"
import { AlbumType } from "../../services/network/models/spotify/SpotifyCommon"
import { albumDimensions, styles } from "../../features/home/styles"
import UIHelper from "../helpers/UIHelper"

const ArtistCover = ({
  album: item,
  onPress,
  coverShape,
}: {
  album: AlbumType
  onPress: (id: string) => void
  coverShape: "CIRCLE" | "SQUARE"
}) => {
  const scale = new Animated.Value(1)
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPressIn={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.in).start()
        }
        onPressOut={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.out).start()
        }
        onPress={() => onPress(item.id)}
        style={{ marginHorizontal: 8, flexDirection: "column" }}>
        <FastImage
          source={{
            uri: (item && item.imageURL) || "",
          }}
          style={{
            height: albumDimensions.ALBUM_DIMEN_RECENT,
            width: albumDimensions.ALBUM_DIMEN_RECENT,
            borderRadius: coverShape === "CIRCLE" ? 80 : 0,
          }}
        />
        <View
          style={{
            width: albumDimensions.ALBUM_DIMEN_RECENT,
            marginTop: 5,
            alignSelf: "center",
          }}>
          <Text
            numberOfLines={2}
            style={[
              styles.centeredText,
              {
                fontSize: 13,
                textAlign: "center",
              },
            ]}>
            {item && item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default ArtistCover
