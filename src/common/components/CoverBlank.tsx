import React from "react"
import { ImageStyle } from "react-native"
import FastImage from "react-native-fast-image"
import { coverImages } from "../theme/coverImages"

export const CoverBlank = ({ styles }: { styles: ImageStyle[] }) => (
  <FastImage source={coverImages.noPlaylist} style={styles} />
)

export default CoverBlank
