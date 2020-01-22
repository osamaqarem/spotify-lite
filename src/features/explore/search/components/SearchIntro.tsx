import React from "react";
import { Text } from "react-native";
import { COLORS } from "../../../../utils";

const SearchIntro = () => {
  return (
    <>
      <Text
        style={{
          fontWeight: "600",
          fontSize: 18,
          color: COLORS.white,
          letterSpacing: 0.3,
          textAlign: "center",
        }}>
        Find the music you love
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: COLORS.grey,
          marginTop: 10,
        }}>
        from millions of artists, songs and playlists
      </Text>
    </>
  );
};

export default SearchIntro;
