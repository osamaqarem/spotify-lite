import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Cover from "./Cover";
import CoverBlank from "./CoverBlank";
import { COLORS } from "../utils";
import { AlbumType } from "../data/models/spotify";
import { TouchableOpacity } from "react-native-gesture-handler";

const Artist = ({
  artist,
  onArtistPressed,
}: {
  artist: AlbumType;
  onArtistPressed: (id: string | undefined) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onArtistPressed(artist.id)}
      style={styles.flatListContainer}>
      {artist.url ? (
        <Cover uri={artist.url} />
      ) : (
        <CoverBlank styles={[styles.cover]} />
      )}
      <View style={styles.rowText}>
        <Text style={styles.artistTitle} numberOfLines={1}>
          {artist.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    marginLeft: 15,
    marginVertical: 10,
    flex: 1,
    flexDirection: "row",
    maxWidth: "77%",
  },
  artistTitle: {
    color: COLORS.white,
    textAlignVertical: "center",
    fontSize: 16,
  },
  artistOwner: {
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

export default Artist;
