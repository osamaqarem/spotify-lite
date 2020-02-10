import React from "react";
import { Text, View } from "react-native";
import { COLORS } from "../../../../utils/constants";

const SearchIntro = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
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
    </View>
  );
};

export default SearchIntro;
