import React, { useContext } from "react"
import { Text, View } from "react-native"
import { NavigationContext } from "react-navigation"
import { connect, ConnectedProps } from "react-redux"
import { Routes } from "../../navigation/_routes"
import AlbumItem from "./AlbumItem"
import { styles } from "../styles"
import { getPlaylistById } from "../../../redux/slices/playlistSlice"
import { AlbumType } from "../../../services/network/models/spotify/SpotifyCommon"
import { RootStoreType } from "../../../redux/rootReducer"

const FeaturedPlaylists = ({
  featuredPlaylists,
  getPlaylistById,
}: ReduxProps) => {
  const navigation = useContext(NavigationContext)

  const onPlaylistPressed = (id: string) => {
    getPlaylistById(id)
    navigation.navigate(Routes.BottomTabs.HomeStack.PlaylistDetails)
  }

  return (
    <>
      <Text style={[styles.centeredText, styles.headerText, { marginTop: 34 }]}>
        Featured playlists
      </Text>
      <View style={styles.content}>
        {featuredPlaylists &&
          featuredPlaylists.map((album: AlbumType, index: number) => (
            <AlbumItem
              key={album.id}
              {...{
                album,
                index,
                onPress: onPlaylistPressed,
              }}
            />
          ))}
      </View>
    </>
  )
}

const mapStateToProps = (state: RootStoreType) => ({
  featuredPlaylists: state.browseReducer.featuredPlaylists,
})

const mapDispatchToProps = {
  getPlaylistById,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(FeaturedPlaylists)
