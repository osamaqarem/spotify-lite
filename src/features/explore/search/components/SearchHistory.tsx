import React from "react"
import { Text, StyleSheet } from "react-native"
import Animated from "react-native-reanimated"
import { AlbumType } from "../../../../services/network/models/spotify/SpotifyCommon"
import { colors } from "../../../../common/theme"
import UIHelper from "../../../../common/helpers/UIHelper"
import HistoryRow from "./HistoryRow"
import { MARGIN_HORIZONTAL } from "./ResultRow"

const clock = new Animated.Clock()
const opacityAnim = UIHelper.runTiming(clock, 0.5, 1, 250)

const SearchHistory = React.memo(
  ({
    queryHistory,
    handleRemove,
    handleResultPress,
    clearAll,
  }: {
    queryHistory: AlbumType[]
    handleRemove: (item: AlbumType) => void
    handleResultPress: (item: AlbumType) => void
    clearAll: () => void
  }) => {
    return (
      <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
        <Text style={styles.title}>Recent searches</Text>
        {queryHistory.map(item => (
          <HistoryRow
            item={item}
            key={item.id}
            handleRemove={handleRemove}
            handleResultPress={handleResultPress}
          />
        ))}
        <Text onPress={clearAll} style={styles.clear}>
          Clear all
        </Text>
      </Animated.View>
    )
  },
)

SearchHistory.displayName = "SearchHistory"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: 18,
    color: colors.white,
    letterSpacing: 0.6,
    textAlign: "center",
  },
  clear: {
    marginTop: 16,
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.8,
    marginLeft: MARGIN_HORIZONTAL,
    alignSelf: "flex-start",
    padding: 4,
  },
})

export default SearchHistory
