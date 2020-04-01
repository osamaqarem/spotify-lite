import React from "react"
import { View } from "react-native"
import { PlaylistDetailsType } from "../../redux/slices"
import { colors } from "../theme"
import DownloadHeader from "./DownloadHeader"
import Track from "./Track"

const ListOfTracks = ({
  playlistDetails,
  showDownload,
}: {
  playlistDetails: PlaylistDetailsType
  showDownload: boolean
}) => (
  <View
    style={{
      backgroundColor: colors.background,
    }}>
    <View
      style={{
        flex: 1,
        marginHorizontal: 10,
      }}>
      {showDownload && <DownloadHeader />}
      {Array.isArray(playlistDetails.tracks) &&
        playlistDetails.tracks.map((track, index) => (
          <Track key={index} title={track.name} artist={track.artistName} />
        ))}
    </View>
  </View>
)

export default ListOfTracks
