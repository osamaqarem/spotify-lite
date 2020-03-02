import React, { useEffect } from "react"
import { NavigationStackProp } from "react-navigation-stack"
import { connect, ConnectedProps } from "react-redux"
import ListOfAlbums from "../../../common/components/ListOfAlbums"
import { RootStoreType } from "../../../redux/rootReducer"
import { getCurrentUserSavedAlbums } from "../../../redux/slices/librarySlice"
import { getAlbumById } from "../../../redux/slices/albumSlice"
import { Routes } from "../../navigation/_routes"

const FavoriteAlbums = ({
  getCurrentUserSavedAlbums,
  currentUserAlbums,
  getAlbumById,
  navigation,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  useEffect(() => {
    getCurrentUserSavedAlbums()
  }, [getCurrentUserSavedAlbums])

  const onPlaylistPressed = (id: string) => {
    getAlbumById(id)
    navigation.navigate(Routes.BottomTabs.FavoritesStack.PlaylistDetails)
  }

  return (
    <ListOfAlbums
      currentUserAlbums={currentUserAlbums}
      onPlaylistPressed={onPlaylistPressed}
    />
  )
}

const mapStateToProps = (state: RootStoreType) => ({
  currentUserAlbums: state.libraryReducer.currentUserSavedAlbums,
})

const mapDispatchToProps = {
  getCurrentUserSavedAlbums,
  getAlbumById,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(FavoriteAlbums)
