import React from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { COLORS } from "../../utils";
import AlbumCover from "./AlbumCover";
import DownloadHeader from "./DownloadHeader";
import PlayListDetailsHeader from "./PlayListDetailsHeader";
import ShuffleButton from "./ShuffleButton";
import Track from "./Track";

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

  const marginAnim = offsetY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

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
            backgroundColor: COLORS.background,
          }}>
          <AlbumCover offsetY={offsetY} />
          <Animated.View
            style={{
              zIndex: 10,
              backgroundColor: COLORS.background,
              marginTop: marginAnim,
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
