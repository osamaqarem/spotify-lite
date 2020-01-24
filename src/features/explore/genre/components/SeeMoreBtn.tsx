import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../../utils";

const SeeMoreBtn = ({
  onPress,
  isVisible,
}: {
  onPress: () => void;
  isVisible: boolean;
}) => {
  return (
    <View style={[styles.container, { opacity: isVisible ? 1 : 0 }]}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.btnText}>SEE MORE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: "center",
    height: 32,
  },
  button: {
    width: 144,
    height: 32,
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
