import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { COLORS } from "../../utils";
import { PlaylistCoverBlank, PlaylistCover } from "../common/PlaylistCover";

type RenderItemType = { item: any; index: number };

const PlaylistRowFav = ({ savedTracksCount }: { savedTracksCount: number }) => (
  <>
    <FastImage
      source={require("../../data/assets/savedTracks.jpg")}
      style={styles.cover}
    />
    <View style={styles.favRowText}>
      <Text style={styles.playlistTitle}>Favorite Songs</Text>
      <Text style={styles.playlistOwner}>
        {(savedTracksCount && savedTracksCount + " favorite songs") || ""}
      </Text>
    </View>
    <View style={styles.lineBreak} />
  </>
);

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
    maxWidth: "77%",
  },
  playlistTitle: {
    color: COLORS.textLight,
    textAlignVertical: "center",
    fontSize: 16,
  },
  playlistOwner: {
    color: COLORS.textDim,
    textAlignVertical: "center",
  },
  cover: {
    height: 50,
    width: 50,
  },
  lineBreak: { flexBasis: "100%" },
  rowText: {
    marginLeft: 10,
    justifyContent: "center",
  },
  favRowText: {
    marginLeft: 10,
    justifyContent: "center",
    marginBottom: 15,
  },
});

export default PlaylistsList;
