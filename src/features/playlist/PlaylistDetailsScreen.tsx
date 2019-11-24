import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { COLORS } from "../../utils";
import AlbumCover from "./AlbumCover";
import DownloadHeader from "./DownloadHeader";
import PlayListDetailsHeader from "./PlayListDetailsHeader";
import ShuffleButton from "./ShuffleButton";
import Track from "./Track";
import LinearGradient from "react-native-linear-gradient";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";

export const HEADER_HEIGHT = 50;
export const ICON_SIZE = 24;

const onScroll = (contentOffset: {
  x?: Animated.Node<number>;
  y?: Animated.Node<number>;
}) =>
  Animated.event([
    {
      nativeEvent: {
        contentOffset,
      },
    },
  ]);

const PlaylistDetailsScreen = () => {
  const offsetY = new Animated.Value(0);

  useEffect(() => {
    const test = async () => {
      await colorsFromUrl(
        "https://source.unsplash.com/random/800x600",
        (err: any, colors: any) => {
          // TODO: set lineargradient color from URL
          console.log(JSON.stringify(colors));
        },
      );
    };

    test();
  }, []);
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
        }}>
        <Animated.ScrollView
          onScroll={onScroll({ y: offsetY })}
          scrollEventThrottle={1}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          style={{
            backgroundColor: "crimson",
          }}>
          <AlbumCover offsetY={offsetY} />
          <Animated.View
            style={{
              zIndex: 10,
              backgroundColor: COLORS.background,
              marginTop: 20,
            }}>
            <ShuffleButton />
            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
              }}>
              <DownloadHeader />
              {albumData.map((track, index) => (
                <Track key={index} title={track.name} artist={track.artist} />
              ))}
            </View>
          </Animated.View>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.8 }}
            colors={[
              "#8A425A", // TODO: change to dynamic value
              COLORS.background,
              COLORS.background,
              COLORS.background,
              COLORS.background,
              COLORS.background,
            ]}
            style={{
              alignSelf: "center",
              opacity: 1,
              ...StyleSheet.absoluteFillObject,
              position: "absolute",
            }}
          />
        </Animated.ScrollView>
        <PlayListDetailsHeader />
      </View>
    </>
  );
};

const albumData = [
  { name: "Be on My Side", artist: "Kip Nelson" },
  { name: "Personal", artist: "Blue Material" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
];

export default PlaylistDetailsScreen;
