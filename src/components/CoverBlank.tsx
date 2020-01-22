import React from "react";
import { ImageStyle } from "react-native";
import FastImage from "react-native-fast-image";

export const CoverBlank = ({ styles }: { styles: ImageStyle[] }) => (
  <FastImage
    source={require("../data/assets/cover/noPlaylistImage.jpg")}
    style={styles}
  />
);

export default CoverBlank;
