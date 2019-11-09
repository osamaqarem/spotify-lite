import React from "react";
import { StyleSheet, ImageStyle } from "react-native";
import FastImage from "react-native-fast-image";

export const PlaylistCover = ({ uri }: { uri: string }) => {
  return (
    <>
      <FastImage
        source={{
          uri,
        }}
        style={styles.cover}
      />
    </>
  );
};

export const PlaylistCoverBlank = ({ styles }: { styles: ImageStyle[] }) => (
  <FastImage
    source={require("../../data/assets/noPlaylistImage.jpg")}
    style={styles}
  />
);

const styles = StyleSheet.create({
  cover: {
    height: 50,
    width: 50,
  },
});
