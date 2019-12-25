import React from "react";
import { View } from "react-native";
import { PlaylistDetailsType } from "../redux/reducers/playlistReducer";
import { COLORS, ratio } from "../utils";
import DownloadHeader from "./DownloadHeader";
import Track from "./Track";

const PlaylistContent = ({
  playlistDetails,
  showDownload,
}: {
  playlistDetails: PlaylistDetailsType;
  showDownload: boolean;
}) => (
  <View
    style={{
      backgroundColor: COLORS.background,
      paddingTop: 44 * ratio,
    }}>
    <View
      style={{
        flex: 1,
        marginHorizontal: 10,
      }}>
      {showDownload && <DownloadHeader />}
      {playlistDetails.tracks.map((track, index) => (
        <Track key={index} title={track.name} artist={track.artistName} />
      ))}
    </View>
  </View>
);

export default PlaylistContent;
