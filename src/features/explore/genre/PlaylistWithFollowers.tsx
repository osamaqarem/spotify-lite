import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import Animated from "react-native-reanimated";
import { GenrePlaylist } from "../../../redux/reducers/browseReducer";
import { btnScaleAnim, COLORS } from "../../../utils";

const albumDimensions = {
  ROW_SCROLLVIEW_HEIGHT: 180,
  ALBUM_DIMEN_RECENT: 166 - 38,
  ALBUM_DIMEN_FEATURED: 156,
};

const PlaylistWithFollowers = ({
  playlist,
  onPress,
}: {
  playlist: GenrePlaylist;
  onPress: () => void;
}) => {
  const scale = new Animated.Value(1);
  return (
    <Animated.View
      style={{
        transform: [{ scale }],
        justifyContent: "space-around",
        marginHorizontal: 15,
        marginBottom: 38,
      }}>
      <TouchableOpacity
        onPressIn={() => Animated.timing(scale, btnScaleAnim.in).start()}
        onPressOut={() => Animated.timing(scale, btnScaleAnim.out).start()}
        onPress={onPress}
        key={playlist.name}
        style={[{ width: albumDimensions.ALBUM_DIMEN_FEATURED }]}>
        <FastImage
          source={{
            uri: playlist.imageUrl ?? "",
          }}
          style={{
            height: albumDimensions.ALBUM_DIMEN_FEATURED,
            width: albumDimensions.ALBUM_DIMEN_FEATURED,
            marginTop: 16,
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
            {playlist.followerCount.toLocaleString()} FOLLOWERS
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PlaylistWithFollowers;
