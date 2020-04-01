import React from "react"
import { StyleSheet, Text, View } from "react-native"
import FastImage from "react-native-fast-image"
import { colors } from "../../../../common/theme"
import { playlistStyle } from "../../../../common/components/Playlist"
import { coverImages } from "../../../../common/theme/coverImages"

const PlaylistRowFav = ({
  savedTracksCount,
}: {
  savedTracksCount: number | null
}) => (
  <View style={styles.favRow}>
    <FastImage source={coverImages.savedTracks} style={styles.cover} />
    <View style={styles.favRowText}>
      <Text style={styles.playlistTitle}>Favorite Songs</Text>
      <Text style={styles.playlistOwner}>
        {(savedTracksCount && savedTracksCount + " favorite songs") || ""}
      </Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  cover: {
    height: 50,
    width: 50,
  },
  favRow: {
    flexDirection: "row",
    flexBasis: "100%",
    marginBottom: 20,
  },
  favRowText: {
    marginLeft: playlistStyle.rowTextLeft,
    justifyContent: "center",
  },
  playlistTitle: {
    color: colors.white,
    textAlignVertical: "center",
    fontSize: playlistStyle.titleFontSize,
  },
  playlistOwner: {
    color: colors.grey,
    textAlignVertical: "center",
  },
})

export default PlaylistRowFav
