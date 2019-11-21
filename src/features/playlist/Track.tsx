import React from "react";
import { View, Text } from "react-native";
import { COLORS } from "../../utils";
import DotsView from "./DotsView";

const Track = ({ title, artist }: { title: string; artist: string }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 12.5,
    }}>
    <View
      style={{
        flex: 1,
        flexDirection: "column",
      }}>
      <Text
        style={{
          color: COLORS.white,
          fontSize: 16,
          letterSpacing: 0.6,
        }}>
        {title}
      </Text>
      <Text style={{ color: COLORS.grey, fontSize: 12.5, letterSpacing: 0.6 }}>
        {artist}
      </Text>
    </View>
    <DotsView />
  </View>
);

export default Track;
