import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Cover from "./Cover";
import PlaylistRowFav from "../features/favorites/favorite-playlists/PlaylistFavRow";
import CoverBlank from "./CoverBlank";
import { COLORS } from "../utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SavedPlaylistsType } from "../redux/reducers/playlistReducer";

const Playlist = ({
  item,
  index,
  username,
  savedTracksCount,
  onPlaylistPressed,
}: {
  item: SavedPlaylistsType;
  index: number;
  username: string;
  savedTracksCount: number | null;
  onPlaylistPressed: (id: string) => void;
}) => (
  <TouchableOpacity
    onPress={() => onPlaylistPressed(item.id)}
    style={styles.flatListContainer}>
    {index === 0 && <PlaylistRowFav savedTracksCount={savedTracksCount} />}
    {item.url ? (
      <Cover uri={item.url} />
    ) : (
      <CoverBlank styles={[styles.cover]} />
    )}
    <View style={styles.rowText}>
      <Text style={styles.playlistTitle} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.playlistOwner}>
        by {item.owner === username ? "you" : item.owner}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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

export default Playlist;
