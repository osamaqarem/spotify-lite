import React from "react"
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native"
import { colors } from "../../../common/theme"
import SearchIcon from "../../navigation/components/navigators/bottom-tabs/icons/SearchIcon"

export const SEARCH_BAR_HEIGHT = 58

const TopBarSearch = ({ onSearchPressed }: { onSearchPressed: () => void }) => (
  <TouchableWithoutFeedback onPress={onSearchPressed}>
    <View style={styles.container}>
      <SearchIcon tintColor="#000" textStyle={styles.searchIcon} />
      <View>
        <Text style={styles.text}>Search artists, songs and playlists</Text>
      </View>
    </View>
  </TouchableWithoutFeedback>
)

const styles = StyleSheet.create({
  container: {
    top: 0,
    left: 0,
    height: SEARCH_BAR_HEIGHT,
    backgroundColor: colors.white,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  searchIcon: { marginRight: 15, marginTop: 10 },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
})

export default TopBarSearch
