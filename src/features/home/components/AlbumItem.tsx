import React from "react"
import { Text, TouchableOpacity } from "react-native"
import FastImage from "react-native-fast-image"
import Animated from "react-native-reanimated"
import { albumDimensions, styles } from "../styles"
import UIHelper from "../../../common/helpers/UIHelper"
import { AlbumType } from "../../../services/network/models/spotify/SpotifyCommon"

const AlbumItem = ({
  album,
  onPress,
}: {
  album: AlbumType
  onPress: (id: string) => void
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
        onPress={() => onPress(album.id)}
        key={album.id}
        style={[{ width: albumDimensions.ALBUM_DIMEN_FEATURED }]}>
        <FastImage
          source={{
            uri: (album && album.imageURL) || "",
          }}
          style={{
            height: albumDimensions.ALBUM_DIMEN_FEATURED,
            width: albumDimensions.ALBUM_DIMEN_FEATURED,
            marginTop: 16,
          }}
        />
        <Text numberOfLines={2} style={[styles.centeredText, styles.albumText]}>
          {album && album.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default AlbumItem
