import React, { useEffect, useCallback } from "react"
import { NavigationStackProp } from "react-navigation-stack"
import { connect, ConnectedProps } from "react-redux"
import ListOfArtists from "../../../common/components/ListOfArtists"
import { getCurrentUserSavedArtists } from "../../../redux/slices/followSlice"
import { setArtistId } from "../../../redux/slices/artistSlice"
import { Routes } from "../../navigation/_routes"
import { RootStoreType } from "../../../redux/rootReducer"
import { NavigationEvents } from "react-navigation"

const FavoriteArtists = ({
  getCurrentUserSavedArtists,
  currentUserArtists,
  navigation,
  setArtistId,
}: ReduxProps & {
  navigation: NavigationStackProp
}) => {
  const fetchData = useCallback(() => {
    getCurrentUserSavedArtists()
  }, [getCurrentUserSavedArtists])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const onArtistPressed = (id: string | undefined) => {
    if (id) {
      setArtistId(id)
      navigation.navigate(Routes.BottomTabs.FavoritesStack.ArtistDetails)
    }
  }

  return (
    <>
      <NavigationEvents onWillFocus={fetchData} />
      <ListOfArtists
        currentUserArtists={currentUserArtists}
        onArtistPressed={onArtistPressed}
      />
    </>
  )
}

const mapStateToProps = (state: RootStoreType) => ({
  currentUserArtists: state.followRedcuer.currentUserSavedArtists,
})

const mapDispatchToProps = {
  getCurrentUserSavedArtists,
  setArtistId: setArtistId,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(FavoriteArtists)
