import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Cover from "./Cover";
import CoverBlank from "./CoverBlank";
import { COLORS } from "../utils";

const Album = (album: any) => {
  return (
    <View style={styles.flatListContainer}>
      {album.url ? (
        <Cover uri={album.url} />
      ) : (
        <CoverBlank styles={[styles.cover]} />
      )}
      <View style={styles.rowText}>
        <Text style={styles.albumTitle} numberOfLines={1}>
          {album.name}
        </Text>
        <Text style={styles.albumOwner}>by {album.owner}</Text>
      </View>
    </View>
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
  albumTitle: {
    color: COLORS.white,
    textAlignVertical: "center",
    fontSize: 16,
  },
  albumOwner: {
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

export default Album;
