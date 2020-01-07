import React from "react";
import { View, Text, FlatList } from "react-native";
import { GenrePlaylist } from "../../../redux/reducers/browseReducer";
import { COLORS } from "../../../utils";
import SeeMoreBtn from "./SeeMoreBtn";
import GenrePlaylistItem from "./GenrePlaylistItem";

const ListOfGenrePlaylists = ({
  genrePlaylists,
  seeMoreVisible,
  handleSeeMore,
  handlePlaylistPress,
}: {
  genrePlaylists: GenrePlaylist[];
  seeMoreVisible: boolean;
  handleSeeMore: () => void;
  handlePlaylistPress: (playlist: GenrePlaylist) => void;
}) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.background,
        width: "100%",
        flex: 1,
      }}>
      <FlatList
        overScrollMode="never"
        ListHeaderComponent={
          <Text
            style={{
              alignSelf: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 18.5,
            }}>
            Popular Playlists
          </Text>
        }
        ListFooterComponent={
          seeMoreVisible ? <SeeMoreBtn onPress={handleSeeMore} /> : null
        }
        contentContainerStyle={{
          alignItems: "center",
        }}
        style={{
          marginHorizontal: 15,
          marginBottom: 38,
        }}
        numColumns={2}
        data={genrePlaylists}
        keyExtractor={playlist => playlist.name}
        renderItem={({ item: playlist }) => (
          <GenrePlaylistItem
            playlist={playlist}
            onPress={() => handlePlaylistPress(playlist)}
          />
        )}
      />
    </View>
  );
};

export default ListOfGenrePlaylists;
