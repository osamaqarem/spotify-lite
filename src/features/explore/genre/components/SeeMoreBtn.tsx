import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../../../../common/theme"
import { Button } from "react-native-paper"

const SeeMoreBtn = ({
  onPress,
  isVisible,
}: {
  onPress: () => void
  isVisible: boolean
}) => {
  return (
    <View style={[styles.container, { opacity: isVisible ? 1 : 0 }]}>
      <Button onPress={onPress} mode={'outlined'} style={styles.button} labelStyle={styles.btnText} color="white" >SEE MORE</Button>
      {/* <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.btnText}>SEE MORE</Text>
      </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: "center",
  },
  button: {
    borderColor: colors.grey,
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 32,
  },
  btnText: {
    color: colors.white,
    letterSpacing: 1.8,
    fontWeight: "bold",
  },
})

export default SeeMoreBtn
