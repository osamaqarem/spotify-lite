import React, { useEffect, useCallback } from "react"
import { StatusBar } from "react-native"
import { NavigationEvents } from "react-navigation"
import { NavigationStackProp } from "react-navigation-stack"
import { connect, ConnectedProps } from "react-redux"
import ListOfPlaylists from "../../../common/components/ListOfPlaylists"
import {
  getCurrentUserPlaylists,
  getPlaylistById,
  getPlaylistByIdSuccess,
} from "../../../redux/slices/playlistSlice"
import { Routes } from "../../navigation/_routes"
import { RootStoreType } from "../../../redux/rootReducer"
import { getCurrentUserSavedTracks } from "../../../redux/slices/librarySlice"

const FavoritePlaylists = ({
  profile,
  currentUserPlaylists,
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  currentUserSavedTracks,
  savedTracksCount,
  navigation,
  getPlaylistById,
  getPlaylistByIdSuccess,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const fetchData = useCallback(() => {
    getCurrentUserPlaylists()
    getCurrentUserSavedTracks()
  }, [getCurrentUserPlaylists, getCurrentUserSavedTracks])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onPlaylistPressed = (id: string) => {
    getPlaylistById(id)
    navigation.navigate(Routes.BottomTabs.FavoritesStack.PlaylistDetails)
  }

  const onFavSongsPressed = () => {
    currentUserSavedTracks && getPlaylistByIdSuccess(currentUserSavedTracks)
    navigation.navigate(Routes.BottomTabs.FavoritesStack.PlaylistDetails)
  }

  const handleWillFocus = () => {
    StatusBar.setBarStyle("light-content")
    fetchData()
  }

  return (
    <>
      <NavigationEvents onWillFocus={handleWillFocus} />
      <ListOfPlaylists
        username={(profile && profile.display_name) || "Error"}
        currentUserPlaylists={currentUserPlaylists}
        savedTracksCount={savedTracksCount}
        onPlaylistPressed={onPlaylistPressed}
        onFavSongsPressed={onFavSongsPressed}
      />
    </>
  )
}

const mapStateToProps = (state: RootStoreType) => ({
  profile: state.userReducer.profile,
  currentUserPlaylists: state.playlistReducer.currentUserPlaylists,
  savedTracksCount: state.libraryReducer.currentUserSavedTracksCount,
  currentUserSavedTracks: state.libraryReducer.currentUserSavedTracks,
})

const mapDispatchToProp = {
  getCurrentUserPlaylists,
  getCurrentUserSavedTracks,
  getPlaylistById,
  getPlaylistByIdSuccess,
}

const connector = connect(mapStateToProps, mapDispatchToProp)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(FavoritePlaylists)
