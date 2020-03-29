import React, { Component } from "react"
import { StyleSheet, Text, View, Alert, Clipboard, Linking } from "react-native"
import CrossIcon from "./src/common/components/CrossIcon"
import SpotifyButton from "./src/common/components/SpotifyButton"
import { NativeModules } from "react-native"
import { colors } from "./src/common/theme"

export default class ErrorBoundary extends Component {
  private static NO_STACK = "No stack trace."
  private static REPO_URL = "https://github.com/osamaq/spotify-lite/"
  private static ISSUE_URL = "issues/new?title="
  private static ISSUE_BODY =
    "&body=%23%23%23 Description%0A%0A%23%23%23 Stack Trace%0A%0A`Paste it here!`"

  state: { hasError: boolean; error: Error | null } = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  showError = () => {
    Alert.alert(
      this.state.error?.name || "Error",
      this.state.error?.stack || ErrorBoundary.NO_STACK,
      [
        {
          text: "Cancel",
          onPress: () => {
            return
          },
        },
        {
          text: "Copy & Report On GitHub",
          onPress: () => {
            const stackTrace = this.state.error?.stack || ErrorBoundary.NO_STACK
            const errName = this.state.error?.message || "Crash"

            Clipboard.setString(stackTrace)

            Linking.openURL(
              ErrorBoundary.REPO_URL +
                ErrorBoundary.ISSUE_URL +
                errName +
                ErrorBoundary.ISSUE_BODY,
            )
          },
        },
      ],
      {
        cancelable: false,
      },
    )
  }

  reloadApp = () => {
    NativeModules.DevSettings.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.subContainer}>
            <CrossIcon
              color={colors.white}
              handlePress={() => {
                return
              }}
              iconStyle={styles.icon}
              size={80}
            />
            <Text style={styles.bigBoldText}>
              Spotify couldn{"'"}t keep going...
            </Text>
            <Text style={styles.text}>
              It would be great if you can report this!
            </Text>
            <View style={styles.btnContainer}>
              <SpotifyButton text="SHOW ERROR" handlePress={this.showError} />
            </View>
            <View style={styles.restartBtn}>
              <SpotifyButton
                text="RESTART SPOTIFY"
                handlePress={this.reloadApp}
                color={colors.green}
                textColor={colors.white}
              />
            </View>
          </View>
        </View>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "flex-start",
  },
  subContainer: {
    marginTop: "50%",
    marginHorizontal: 30,
    alignItems: "center",
  },
  icon: {
    marginBottom: 18,
  },
  bigBoldText: {
    fontSize: 18,
    color: colors.white,
    letterSpacing: 0.8,
    fontWeight: "bold",
  },
  text: {
    marginTop: 22,
    marginHorizontal: 50,
    lineHeight: 18,
    fontSize: 12,
    color: colors.grey,
    letterSpacing: 0.4,
    textAlign: "center",
  },
  btnContainer: {
    marginTop: 44,
  },
  restartBtn: {
    marginTop: 34,
  },
})
