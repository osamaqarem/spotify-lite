import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../../utils";

export const BUTTON_HEIGHT = 32;

const SeeMoreBtn = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.btnText}>SEE MORE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 52,
    alignItems: "center",
    height: BUTTON_HEIGHT,
  },
  button: {
    width: 144,
    height: BUTTON_HEIGHT,
    backgroundColor: COLORS.background,
    borderColor: COLORS.grey,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    letterSpacing: 1.8,
    fontWeight: "bold",
  },
});

export default SeeMoreBtn;
