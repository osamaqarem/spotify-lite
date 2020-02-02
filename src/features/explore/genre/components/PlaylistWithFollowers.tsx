import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
      style={{
        transform: [{ scale }],
        justifyContent: "space-around",
        marginHorizontal: 15,
        marginVertical: ITEM_DIMENSIONS.MARGIN,
        height: ITEM_DIMENSIONS.WIDTH,
        width: ITEM_DIMENSIONS.WIDTH,
      }}>
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
          style={{
            height: ITEM_DIMENSIONS.WIDTH,
            width: ITEM_DIMENSIONS.WIDTH,
          }}
        />
        <View style={{ height: 50 }}>
          <Text
            numberOfLines={2}
            style={[
              {
                alignSelf: "center",
                color: "white",
                fontWeight: "bold",
              },
              {
                width: "94%",
                marginBottom: 10,
                textAlign: "center",
                color: COLORS.white,
                top: 10,
                fontSize: 13,
              },
            ]}>
            {playlist.name}
          </Text>
          <Text
            style={{
              color: COLORS.grey,
              textAlign: "center",
              marginTop: 6,
              fontSize: 10,
              letterSpacing: 0.4,
            }}>
            {playlist.followerCount?.toLocaleString()} FOLLOWERS
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PlaylistWithFollowers;
