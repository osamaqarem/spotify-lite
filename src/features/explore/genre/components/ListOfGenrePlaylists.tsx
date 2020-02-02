import React from "react";
import { FlatList, Text } from "react-native";
import Animated from "react-native-reanimated";
import { BACKBTN_HEIGHT } from "../../../../components/BackBtn";
import { COLORS, width } from "../../../../utils/constants";
import PlaylistWithFollowers, {
  ITEM_DIMENSIONS,
} from "./PlaylistWithFollowers";
import SeeMoreBtn from "./SeeMoreBtn";
import { PlaylistDetailsType } from "../../../../redux/reducers/playlistReducer";
import UIHelper from "../../../../utils/helpers/UIHelper";

const AnimatedFlatList: typeof FlatList = Animated.createAnimatedComponent(
  FlatList,
);

const ListOfGenrePlaylists = ({
  offsetY,
  seeMoreVisible,
  genrePlaylists,
  handleSeeMore,
  onPlaylistPressed,
}: {
  offsetY: Animated.Node<number>;
  seeMoreVisible: boolean;
  handleSeeMore: () => void;
  genrePlaylists: PlaylistDetailsType[];
  onPlaylistPressed: (playlist: PlaylistDetailsType) => void;
}) => {
  return (
    <AnimatedFlatList
      scrollEventThrottle={1}
      onScroll={UIHelper.onScroll({ y: offsetY })}
      overScrollMode="never"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text
          style={{
            alignSelf: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 18.5,
            width: width,
            textAlign: "center",
            marginBottom: 20,
          }}>
          Popular Playlists
        </Text>
      }
      ListFooterComponent={
        <SeeMoreBtn onPress={handleSeeMore} isVisible={seeMoreVisible} />
      }
      contentContainerStyle={{
        alignItems: "center",
        marginTop: "40%",
        paddingBottom: "60%",
        width: "100%",
        backgroundColor: COLORS.background,
      }}
      // @ts-ignore
      style={{
        marginHorizontal: 15,
        zIndex: 10,
        width: "100%",
        marginTop: BACKBTN_HEIGHT,
      }}
      numColumns={2}
      data={genrePlaylists}
      keyExtractor={playlist => playlist.name}
      renderItem={({ item: playlist }) => (
        <PlaylistWithFollowers
          key={playlist.name}
          playlist={playlist}
          onPress={() => onPlaylistPressed(playlist)}
        />
      )}
      getItemLayout={(data, index) => ({
        length: ITEM_DIMENSIONS.WIDTH,
        offset: (ITEM_DIMENSIONS.WIDTH + ITEM_DIMENSIONS.MARGIN) * index,
        index,
      })}
    />
  );
};

export default ListOfGenrePlaylists;
