import React from "react";
import { StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { COLORS } from "../../../../utils/constants";
import { playlistStyle } from "../../../../components/Playlist";

const PlaylistRowFav = ({
  savedTracksCount,
}: {
  savedTracksCount: number | null;
}) => (
  <View style={styles.favRow}>
    <FastImage
      source={require("../../../../data/assets/cover/savedTracks.jpg")}
      style={styles.cover}
    />
    <View style={styles.favRowText}>
      <Text style={styles.playlistTitle}>Favorite Songs</Text>
      <Text style={styles.playlistOwner}>
        {(savedTracksCount && savedTracksCount + " favorite songs") || ""}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cover: {
    height: 50,
    width: 50,
  },
  favRow: {
    flexDirection: "row",
    flexBasis: "100%",
    marginBottom: 20,
  },
  favRowText: {
    marginLeft: playlistStyle.rowTextLeft,
    justifyContent: "center",
  },
  playlistTitle: {
    color: COLORS.white,
    textAlignVertical: "center",
    fontSize: playlistStyle.titleFontSize,
  },
  playlistOwner: {
    color: COLORS.grey,
    textAlignVertical: "center",
  },
});

export default PlaylistRowFav;
