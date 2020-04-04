import React from "react"
import { FlatList, Text, StyleSheet } from "react-native"
import Animated from "react-native-reanimated"
import { colors, dimensions } from "../../../../common/theme"
import PlaylistWithFollowers, { ITEM_DIMENSIONS } from "./PlaylistWithFollowers"
import SeeMoreBtn from "./SeeMoreBtn"
import UIHelper from "../../../../common/helpers/UIHelper"
import { PlaylistDetailsType } from "../../../../redux/slices"
import { HEADER_HEIGHT } from "../../../../common/components/PlaylistHeaderControl"

const AnimatedFlatList: typeof FlatList = Animated.createAnimatedComponent(
  FlatList,
)

const ListOfGenrePlaylists = ({
  offsetY,
  seeMoreVisible,
  genrePlaylists,
  handleSeeMore,
  onPlaylistPressed,
}: {
  offsetY: Animated.Node<number>
  seeMoreVisible: boolean
  handleSeeMore: () => void
  genrePlaylists: PlaylistDetailsType[]
  onPlaylistPressed: (playlist: PlaylistDetailsType) => void
}) => {
  const handleRender = ({ item: playlist }: { item: PlaylistDetailsType }) => (
    <PlaylistWithFollowers
      key={playlist.name}
      playlist={playlist}
      onPress={() => onPlaylistPressed(playlist)}
    />
  )

  return (
    <AnimatedFlatList
      scrollEventThrottle={1}
      onScroll={UIHelper.onScroll({ y: offsetY })}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<Text style={styles.title}>Popular Playlists</Text>}
      ListFooterComponent={
        <SeeMoreBtn onPress={handleSeeMore} isVisible={seeMoreVisible} />
      }
      contentContainerStyle={styles.content}
      // @ts-ignore
      style={styles.list}
      numColumns={2}
      data={genrePlaylists}
      keyExtractor={(playlist) => playlist.name}
      renderItem={handleRender}
      getItemLayout={(data, index) => ({
        length: ITEM_DIMENSIONS.WIDTH,
        offset: (ITEM_DIMENSIONS.WIDTH + ITEM_DIMENSIONS.MARGIN) * index,
        index,
      })}
    />
  )
}

const styles = StyleSheet.create({
  title: {
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 18.5,
    width: "100%",
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    alignItems: "center",
    marginTop: "40%",
    paddingBottom: "60%",
    width: "100%",
    backgroundColor: colors.background,
  },
  list: {
    marginHorizontal: 15,
    zIndex: 10,
    width: "100%",
    marginTop: HEADER_HEIGHT + 50,
  },
})

export default ListOfGenrePlaylists
