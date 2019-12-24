import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../utils";
import PlaylistRowFav from "./PlaylistFavRow";
import PlaylistCoverBlank from "./PlaylistCoverBlank";
import PlaylistCover from "./PlaylistCover";

const PlaylistItem = ({
  item,
  index,
  username,
  savedTracksCount,
}: {
  item: any;
  index: number;
  username: string;
  savedTracksCount: number;
}) => (
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

const PlaylistsList = ({ data, username }: { data: any; username: string }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data.currentUserPlaylists}
        renderItem={({ item, index }) => (
          <PlaylistItem
            {...{
              item,
              index,
              username,
              savedTracksCount: data.savedTracksCount,
            }}
          />
        )}
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
