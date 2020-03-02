import { Dimensions } from "react-native"

const { height, width } = Dimensions.get("window")

const ratio = (width / 414 / height) * 1000

const widthRatio = width / 500
const heightRatio = height / 500

export const dimensions = {
  height,
  width,
  ratio,
  widthRatio,
  heightRatio,
}
