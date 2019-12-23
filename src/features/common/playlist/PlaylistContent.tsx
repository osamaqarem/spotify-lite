import React from "react";
import { View, Text } from "react-native";
import DownloadHeader from "../details/DownloadHeader";
import Track from "../details/Track";
import { COLORS, ratio } from "../../../utils";
import { PlaylistDetailsType } from "../../../redux/reducers/playlistReducer";

const PlaylistContent = ({
  playlistDetails,
}: {
  playlistDetails: PlaylistDetailsType;
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
      <DownloadHeader />
      {playlistDetails.tracks.map((track, index) => (
        <Track key={index} title={track.name} artist={track.artistName} />
      ))}
    </View>
  </View>
);

export default PlaylistContent;
