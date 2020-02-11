import React from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";
import { COLORS } from "../../../../utils/constants";
import UIHelper from "../../../../utils/helpers/UIHelper";

const SearchIntro = React.memo(() => {
  const clock = new Animated.Clock();
  const opacityAnim = UIHelper.opacityTiming(clock, 0.5, 1, 250);

  return (
    <Animated.View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        opacity: opacityAnim,
      }}>
      <Text
        style={{
          fontWeight: "600",
          fontSize: 16,
          color: COLORS.white,
          letterSpacing: 0.3,
          textAlign: "center",
        }}>
        Find the music you love
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: COLORS.grey,
          marginTop: 10,
          textAlign: "center",
        }}>
        from millions of artists, songs and playlists
      </Text>
    </Animated.View>
  );
});

SearchIntro.displayName = "SearchIntro";

export default SearchIntro;
