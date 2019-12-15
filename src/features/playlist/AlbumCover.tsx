import React from "react";
import { Text, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { COLORS } from "../../utils";

const AlbumCover = ({
  offsetY,
  artistName,
  name,
  imageUrl,
}: {
  offsetY: Animated.Value<number>;
  name: string | undefined;
  artistName: string | undefined;
  imageUrl: string | undefined;
}) => {
  const scaleAnim = offsetY.interpolate({
    inputRange: [0, 250],
    outputRange: [1, 0.9],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const opacityAnim = offsetY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scaleX: scaleAnim }, { scaleY: scaleAnim }],
        },
      ]}>
      <FastImage style={styles.cover} source={{ uri: imageUrl }} />
      <View style={styles.textContainer}>
        <Text
          numberOfLines={2}
          style={[
            styles.title,
            { fontSize: name && name.length > 36 ? 12 : 18 },
          ]}>
          {name}
        </Text>
        <Text style={styles.artist}>{artistName}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  cover: {
    marginTop: 16,
    height: 165,
    width: 165,
  },
  textContainer: { marginTop: 20, alignItems: "center" },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.6,
    textAlign: "center",
    marginHorizontal: 50,
  },
  artist: {
    marginTop: 5,
    color: COLORS.grey,
    fontSize: 14,
    letterSpacing: 0.6,
  },
});

export default AlbumCover;
