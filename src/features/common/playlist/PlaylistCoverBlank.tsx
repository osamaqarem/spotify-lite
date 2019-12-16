import React from "react";
import { ImageStyle } from "react-native";
import FastImage from "react-native-fast-image";

export const PlaylistCoverBlank = ({ styles }: { styles: ImageStyle[] }) => (
  <FastImage
    source={require("../../data/assets/noPlaylistImage.jpg")}
    style={styles}
  />
);

export default PlaylistCoverBlank;
