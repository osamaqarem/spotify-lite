import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../utils";
import DotsView from "./DotsView";
import { HEADER_HEIGHT, ICON_SIZE } from "./PlaylistDetailsScreen";

const PlayListDetailsHeader = () => (
  <View
    style={{
      height: HEADER_HEIGHT,
      ...StyleSheet.absoluteFillObject,
    }}>
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
      }}>
      <Icon
        name="arrow-left"
        size={ICON_SIZE}
        style={{
          color: COLORS.white,
          position: "absolute",
          left: 15,
        }}
      />
      <Text
        style={{
          opacity: 0.5,
          fontSize: 16,
          fontWeight: "bold",
          letterSpacing: 0.6,
          color: COLORS.white,
        }}>
        Psyche Pop & Surf Rock
      </Text>
      <Icon
        name={true ? "heart" : "heart-outline"} // TODO: heart
        size={ICON_SIZE}
        style={{
          color: COLORS.green,
          right: 54,
          position: "absolute",
        }}
      />
      <View
        style={{
          position: "absolute",
          right: 15,
        }}>
        <DotsView />
      </View>
    </View>
  </View>
);

export default PlayListDetailsHeader;
