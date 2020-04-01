import React, { useEffect } from "react"
import { StatusBar, StyleSheet, View, Platform } from "react-native"
import { NavigationEvents, SafeAreaView } from "react-navigation"
import { connect, ConnectedProps } from "react-redux"

import { Routes } from "../navigation/_routes"
import ListOfColoredCards from "./components/ListOfColoredCards"
import TopBarSearch from "./components/TopBarSearch"
import { NavigationStackProp } from "react-navigation-stack"
import { RootStoreType } from "../../redux/rootReducer"
import {
  getAllCategoriesForCountry,
  getCategoryById,
} from "../../redux/slices/browseSlice"
import { colors } from "../../common/theme"

const Explore = ({
  categoriesForCountry,
  getAllCategoriesForCountry,
  getCategoryById,
  navigation,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  useEffect(() => {
    getAllCategoriesForCountry()
  }, [getAllCategoriesForCountry])

  const handleWillFocus = () => {
    Platform.select({
      ios: StatusBar.setBarStyle("dark-content"),
      android: StatusBar.setBarStyle("default"),
    })
  }

  const onGenrePressed = (id: string, title: string) => {
    getCategoryById({ id, title, getRestOfItems: false })
    navigation.navigate(Routes.BottomTabs.ExploreStack.Genre)
  }

  const onSearchPressed = () => {
    navigation.navigate(Routes.BottomTabs.ExploreStack.Search)
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <NavigationEvents onWillFocus={handleWillFocus} />
      <View style={styles.container}>
        <TopBarSearch onSearchPressed={onSearchPressed} />
        <ListOfColoredCards
          categoriesForCountry={categoriesForCountry}
          onGenrePressed={onGenrePressed}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
})

const mapStateToProps = (state: RootStoreType) => ({
  categoriesForCountry: state.browseReducer.categoriesForCountry,
})

const mapDispatchToPros = {
  getAllCategoriesForCountry,
  getCategoryById,
}

const connector = connect(mapStateToProps, mapDispatchToPros)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(Explore)
