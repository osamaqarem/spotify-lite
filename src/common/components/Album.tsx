import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { colors } from "../theme"
import Cover from "./Cover"
import CoverBlank from "./CoverBlank"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SavedAlbumType } from "../../redux/slices"

const Album = ({
  album,
  onPlaylistPressed,
}: {
  album: SavedAlbumType
  onPlaylistPressed: (id: string) => void
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPlaylistPressed(album.id)
      }}
      style={styles.flatListContainer}>
      {album.url ? (
        <Cover uri={album.url} />
      ) : (
        <CoverBlank styles={[styles.cover]} />
      )}
      <View style={styles.rowText}>
        <Text style={styles.albumTitle} numberOfLines={1}>
          {album.name}
        </Text>
        <Text style={styles.albumOwner}>by {album.owner}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  flatListContainer: {
    marginLeft: 15,
    marginVertical: 10,
    flex: 1,
    flexDirection: "row",
    maxWidth: "77%",
  },
  albumTitle: {
    color: colors.white,
    textAlignVertical: "center",
    fontSize: 16,
  },
  albumOwner: {
    color: colors.grey,
    textAlignVertical: "center",
  },
  cover: {
    height: 50,
    width: 50,
  },
  lineBreak: { flexBasis: "100%" },
  rowText: {
    marginLeft: 10,
    justifyContent: "center",
  },
  favRowText: {
    marginLeft: 10,
    justifyContent: "center",
    marginBottom: 15,
  },
})

export default Album
