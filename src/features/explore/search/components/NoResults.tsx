import React from "react";
import { Text, View } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../../../utils/constants";

const NoResults = ({ queryToShow }: { queryToShow: string }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <MaterialCommunityIcon
        style={{
          marginBottom: 26,
        }}
        name="flag-outline"
        size={64}
        color={COLORS.white}
      />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
          color: COLORS.white,
          letterSpacing: 0.3,
          textAlign: "center",
          lineHeight: 22,
          maxWidth: "70%",
        }}>
        No results found for {`\'${queryToShow}\'`}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: COLORS.grey,
          marginTop: 22,
          textAlign: "center",
          maxWidth: "70%",
          lineHeight: 20,
        }}>
        Please check you have the right spelling, or try different keywords.
      </Text>
    </View>
  );
};

export default NoResults;
