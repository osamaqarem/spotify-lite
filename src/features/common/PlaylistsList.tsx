import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../utils";
import { PlaylistCover } from "./PlaylistCover";
import PlaylistRowFav from "./PlaylistFavRow";
import PlaylistCoverBlank from "./PlaylistCoverBlank";

type RenderItemType = { item: any; index: number };

const renderItem = (
  { item, index }: RenderItemType,
  username: string,
  savedTracksCount: number,
) => {
  return (
    <View style={styles.flatListContainer}>
      {index === 0 && <PlaylistRowFav savedTracksCount={savedTracksCount} />}
      {item.url ? (
        <PlaylistCover uri={item.url} />
      ) : (
        <PlaylistCoverBlank styles={[styles.cover]} />
      )}
      <View style={styles.rowText}>
        <Text style={styles.playlistTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.playlistOwner}>
          by {item.owner === username ? "you" : item.owner}
        </Text>
      </View>
    </View>
  );
};

const PlaylistsList = ({ data, username }: { data: any; username: string }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data.currentUserPlaylists}
        renderItem={({ item, index }: RenderItemType) => {
          return renderItem({ item, index }, username, data.savedTracksCount);
        }}
        keyExtractor={(_, index) => {
          return index + "";
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flatListContainer: {
    marginLeft: 15,
    marginVertical: 10,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: "77%",
  },
  playlistTitle: {
    color: COLORS.white,
    textAlignVertical: "center",
    fontSize: 16,
  },
  playlistOwner: {
    color: COLORS.grey,
    textAlignVertical: "center",
  },
  cover: {
    height: 50,
    width: 50,
  },
  rowText: {
    marginLeft: 10,
    justifyContent: "center",
  },
});

export default PlaylistsList;
