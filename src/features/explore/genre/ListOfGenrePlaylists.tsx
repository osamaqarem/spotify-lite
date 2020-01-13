import React from "react";
import { FlatList, Text } from "react-native";
import Animated from "react-native-reanimated";
import { BACKBTN_HEIGHT } from "../../../components/BackBtn";
import { GenrePlaylist } from "../../../redux/reducers/browseReducer";
import { COLORS, onScroll, width } from "../../../utils";
import PlaylistWithFollowers from "./PlaylistWithFollowers";
import SeeMoreBtn from "./SeeMoreBtn";

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
  genrePlaylists: GenrePlaylist[];
  onPlaylistPressed: (playlist: GenrePlaylist) => void;
}) => {
  return (
    <AnimatedFlatList
      scrollEventThrottle={1}
      onScroll={onScroll({ y: offsetY })}
      overScrollMode="never"
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
        seeMoreVisible ? <SeeMoreBtn onPress={handleSeeMore} /> : null
      }
      contentContainerStyle={{
        alignItems: "center",
        marginTop: "40%",
        paddingBottom: "100%",
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
    />
  );
};

export default ListOfGenrePlaylists;
