import React from "react"
import { FlatList, View } from "react-native"
import { AlbumType } from "../../services/network/models/spotify/SpotifyCommon"
import { colors } from "../theme"
import Artist from "./Artist"
import { PLAYER_HEIGHT } from "../../features/player/StickyPlayer"

const ListOfArtists = ({
  currentUserArtists,
  onArtistPressed,
}: {
  currentUserArtists: AlbumType[]
  onArtistPressed: (id: string | undefined) => void
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <FlatList
        contentContainerStyle={{ paddingBottom: PLAYER_HEIGHT + 10 }}
        data={currentUserArtists}
        renderItem={({ item }) => (
          <Artist artist={item} onArtistPressed={onArtistPressed} />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  )
}

export default ListOfArtists
