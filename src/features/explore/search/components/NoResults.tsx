import React from "react";
import { Text, View, StyleSheet } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../../../utils/constants";

const NoResults = ({ queryToShow }: { queryToShow: string }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcon
        style={styles.flagIcon}
        name="flag-outline"
        size={64}
        color={COLORS.white}
      />
      <Text style={styles.query}>
        No results found for {`\'${queryToShow}\'`}
      </Text>
      <Text style={styles.tip}>
        Please check you have the right spelling, or try different keywords.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flagIcon: {
    marginBottom: 26,
  },
  query: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: 0.3,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: "70%",
  },
  tip: {
    fontSize: 14,
    color: COLORS.grey,
    marginTop: 22,
    textAlign: "center",
    maxWidth: "70%",
    lineHeight: 20,
  },
});

export default NoResults;
