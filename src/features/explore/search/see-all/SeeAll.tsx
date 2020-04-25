import React from "react"
import { StatusBar, StyleSheet, Text, View, ScrollView } from "react-native"
import { NavigationEvents, SafeAreaView } from "react-navigation"
import { NavigationStackProp } from "react-navigation-stack"
import { connect, ConnectedProps } from "react-redux"
import { RootStoreType } from "../../../../redux/rootReducer"
import { colors } from "../../../../common/theme"
import { SEARCH_BAR_HEIGHT } from "../../components/TopBarSearch"
import BackBtnSearch from "../components/BackBtnSearch"
import ResultRow from "../components/ResultRow"

type SeeAllType = { navigation: NavigationStackProp } & ReduxProps

const SeeAll = ({ navigation, lastQuery, data, type }: SeeAllType) => {
  const handleWillFocus = () => {
    StatusBar.setBarStyle("light-content")
  }

  const items =
    data &&
    data.map((item) => (
      <ResultRow
        containerStyle={{ marginTop: 14 }}
        coverStyle={{ height: 44, width: 44 }}
        result={item}
        key={item.id}
        handleResultPress={() => {
          return
        }}
      />
    ))

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <NavigationEvents onWillFocus={handleWillFocus} />
        <View style={styles.bar}>
          <BackBtnSearch
            onPress={() => navigation.goBack()}
            tintColor={colors.lightGrey}
            textStyle={styles.backBtnIcon}
          />
          <Text style={styles.text}>
            {`"${lastQuery}"`} in {type}s
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            marginHorizontal: 4,
            paddingBottom: 10,
          }}>
          {items}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.tabBar,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bar: {
    top: 0,
    left: 0,
    height: SEARCH_BAR_HEIGHT,
    backgroundColor: colors.tabBar,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.8,
    color: colors.white,
  },
  backBtnIcon: {
    position: "absolute",
    left: 0,
    paddingLeft: 34,
    padding: 14,
    height: "100%",
    textAlignVertical: "center",
  },
})

const mapStateToProps = (state: RootStoreType) => ({
  data: state.searchReducer.seeAll.data,
  type: state.searchReducer.seeAll.type,
  lastQuery: state.searchReducer.lastQuery,
})

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(SeeAll)
