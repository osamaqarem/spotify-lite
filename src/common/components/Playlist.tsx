import React from "react"
import { View, Text, StyleSheet } from "react-native"
import Cover from "./Cover"
import CoverBlank from "./CoverBlank"
import { colors } from "../theme"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SavedPlaylistsType } from "../../redux/slices"

export const playlistStyle = {
  vertical: 6.5,
  left: 15,
  rowTextLeft: 10,
  titleFontSize: 16,
}

const Playlist = ({
  item,
  username,
  onPlaylistPressed,
}: {
  item: SavedPlaylistsType
  username: string
  onPlaylistPressed: (id: string) => void
}) => (
  <TouchableOpacity
    onPress={() => onPlaylistPressed(item.id)}
    style={styles.item}>
    {item.url ? (
      <Cover uri={item.url} />
    ) : (
      <CoverBlank styles={[styles.cover]} />
    )}
    <View style={styles.rowText}>
      <Text style={styles.playlistTitle} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.playlistOwner}>
        by {item.owner === username ? "you" : item.owner}
      </Text>
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  item: {
    marginLeft: playlistStyle.left,
    marginVertical: playlistStyle.vertical,
    flex: 1,
    flexDirection: "row",
  },
  playlistTitle: {
    color: colors.white,
    textAlignVertical: "center",
    fontSize: playlistStyle.titleFontSize,
    maxWidth: "80%",
  },
  playlistOwner: {
    color: colors.grey,
    textAlignVertical: "center",
  },
  cover: {
    height: 50,
    width: 50,
  },
  rowText: {
    marginLeft: playlistStyle.rowTextLeft,
    justifyContent: "center",
    width: "100%",
  },
})

export default Playlist
