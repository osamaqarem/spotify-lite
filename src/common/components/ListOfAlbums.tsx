import React from "react"
import { FlatList, View } from "react-native"
import { colors } from "../theme"
import Album from "./Album"
import { SavedAlbumType } from "../../redux/slices"

const ListOfAlbums = ({
  currentUserAlbums,
  onPlaylistPressed,
}: {
  currentUserAlbums: SavedAlbumType[]
  onPlaylistPressed: (id: string) => void
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <FlatList
        data={currentUserAlbums}
        renderItem={({ item }) => (
          <Album album={item} onPlaylistPressed={onPlaylistPressed} />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  )
}

export default ListOfAlbums
