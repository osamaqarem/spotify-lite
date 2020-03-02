import React from "react"
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../../../../../../common/theme"

const HomeIcon = ({ tintColor }: { tintColor: string }) => {
  if (tintColor === colors.itemInactive) {
    return (
      <MaterialCommunityIcon
        style={{ bottom: 6 }}
        name="home-outline"
        size={24.5}
        color={tintColor}
      />
    )
  } else {
    return (
      <MaterialCommunityIcon
        style={{ bottom: 6 }}
        name="home-variant"
        size={24.5}
        color={tintColor}
      />
    )
  }
}

export default HomeIcon
