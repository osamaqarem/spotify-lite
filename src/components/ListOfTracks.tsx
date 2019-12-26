import React from "react";
import { View } from "react-native";
import { PlaylistDetailsType } from "../redux/reducers/playlistReducer";
import { COLORS, ratio } from "../utils";
import DownloadHeader from "./DownloadHeader";
import Track from "./Track";

const ListOfTracks = ({
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
      {playlistDetails.tracks.map(track => (
        <Track key={track.name} title={track.name} artist={track.artistName} />
      ))}
    </View>
  </View>
);

export default ListOfTracks;
