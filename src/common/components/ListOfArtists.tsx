import React from "react"
import { FlatList, View } from "react-native"
import { AlbumType } from "../../services/network/models/spotify/SpotifyCommon"
import { colors } from "../theme"
import Artist from "./Artist"

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
