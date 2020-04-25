import React, { useEffect, useCallback } from "react"
import { NavigationStackProp } from "react-navigation-stack"
import { connect, ConnectedProps } from "react-redux"
import ListOfAlbums from "../../../common/components/ListOfAlbums"
import { RootStoreType } from "../../../redux/rootReducer"
import { getCurrentUserSavedAlbums } from "../../../redux/slices/librarySlice"
import { getAlbumById } from "../../../redux/slices/albumSlice"
import { Routes } from "../../navigation/_routes"
import { NavigationEvents } from "react-navigation"

const FavoriteAlbums = ({
  getCurrentUserSavedAlbums,
  currentUserAlbums,
  getAlbumById,
  navigation,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const fetchData = useCallback(() => {
    getCurrentUserSavedAlbums()
  }, [getCurrentUserSavedAlbums])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onPlaylistPressed = (id: string) => {
    getAlbumById(id)
    navigation.navigate(Routes.BottomTabs.FavoritesStack.PlaylistDetails)
  }

  return (
    <>
      <NavigationEvents onWillFocus={fetchData} />
      <ListOfAlbums
        currentUserAlbums={currentUserAlbums}
        onPlaylistPressed={onPlaylistPressed}
      />
    </>
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
