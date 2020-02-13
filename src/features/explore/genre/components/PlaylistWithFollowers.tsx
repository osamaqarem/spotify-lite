import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { COLORS } from "../../../../utils/constants";
import { PlaylistDetailsType } from "../../../../redux/reducers/playlistReducer";
import UIHelper from "../../../../utils/helpers/UIHelper";

export const ITEM_DIMENSIONS = {
  MARGIN: 46,
  WIDTH: 156,
};

const PlaylistWithFollowers = ({
  playlist,
  onPress,
}: {
  playlist: PlaylistDetailsType;
  onPress: () => void;
}) => {
  const scale = new Animated.Value(1);
  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }],
        },
        styles.container,
      ]}>
      <TouchableOpacity
        onPressIn={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.in).start()
        }
        onPressOut={() =>
          Animated.timing(scale, UIHelper.btnScaleAnim.out).start()
        }
        onPress={onPress}
        key={playlist.name}
        style={[{ width: ITEM_DIMENSIONS.WIDTH }]}>
        <FastImage
          source={{
            uri: playlist.imageUrl ?? "",
          }}
          style={styles.cover}
        />
        <View style={{ height: 50 }}>
          <Text numberOfLines={2} style={styles.name}>
            {playlist.name}
          </Text>
          <Text style={styles.followers}>
            {playlist.followerCount?.toLocaleString()} FOLLOWERS
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginVertical: ITEM_DIMENSIONS.MARGIN,
    height: ITEM_DIMENSIONS.WIDTH,
    width: ITEM_DIMENSIONS.WIDTH,
  },
  cover: {
    height: ITEM_DIMENSIONS.WIDTH,
    width: ITEM_DIMENSIONS.WIDTH,
  },
  name: {
    fontWeight: "bold",
    alignSelf: "center",
    width: "94%",
    marginBottom: 10,
    textAlign: "center",
    color: COLORS.white,
    top: 10,
    fontSize: 13,
  },
  followers: {
    color: COLORS.grey,
    textAlign: "center",
    marginTop: 6,
    fontSize: 10,
    letterSpacing: 0.4,
  },
});

export default PlaylistWithFollowers;
