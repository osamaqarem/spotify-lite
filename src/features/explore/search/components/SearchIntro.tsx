import React from "react";
import { Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { COLORS } from "../../../../utils/constants";
import UIHelper from "../../../../utils/helpers/UIHelper";

const SearchIntro = React.memo(() => {
  const clock = new Animated.Clock();
  const opacityAnim = UIHelper.runTiming(clock, 0.5, 1, 250);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
        },
      ]}>
      <Text style={styles.header}>Find the music you love</Text>
      <Text style={styles.subheader}>
        from millions of artists, songs and playlists
      </Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 0.3,
    textAlign: "center",
  },
  subheader: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 10,
    textAlign: "center",
  },
});

SearchIntro.displayName = "SearchIntro";

export default SearchIntro;
