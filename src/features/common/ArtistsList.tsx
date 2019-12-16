import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../utils";
import { PlaylistCover } from "./playlist/PlaylistCover";
import PlaylistCoverBlank from "./playlist/PlaylistCoverBlank";
import { AlbumType } from "../../data/models";

const renderItem = ({ item }: any) => {
  return (
    <View style={styles.flatListContainer}>
      {item.url ? (
        <PlaylistCover uri={item.url} />
      ) : (
        <PlaylistCoverBlank styles={[styles.cover]} />
      )}
      <View style={styles.rowText}>
        <Text style={styles.playlistTitle} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
    </View>
  );
};

const ArtistsList = ({
  currentUserArtists,
}: {
  currentUserArtists: AlbumType[];
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={currentUserArtists}
        renderItem={renderItem}
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

export default ArtistsList;
