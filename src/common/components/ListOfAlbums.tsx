import React from "react"
import { FlatList, View } from "react-native"
import { colors } from "../theme"
import Album from "./Album"
import { SavedAlbumType } from "../../redux/slices"
import { PLAYER_HEIGHT } from "../../features/player/StickyPlayer"

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
        contentContainerStyle={{ paddingBottom: PLAYER_HEIGHT + 10 }}
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
