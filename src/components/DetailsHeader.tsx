import React from "react";
import {
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, ratio } from "../utils";
import DotsView from "./DotsView";

export const HEADER_HEIGHT = 90;
export const ICON_SIZE = 20 * ratio;

const DetailsHeader = ({
  name,
  goBack,
  isLoading,
}: {
  name: string | undefined;
  goBack: () => void;
  isLoading: boolean;
}) => {
  return (
    <>
      <Icon
        onPress={() => {
          goBack();
        }}
        name="arrow-left"
        size={ICON_SIZE}
        style={[styles.arrowIcon]}
      />

      {!isLoading && (
        <>
          <Icon
            onPress={() => {
              ToastAndroid.show("Heart!", ToastAndroid.SHORT);
            }}
            name={true ? "heart" : "heart-outline"}
            size={ICON_SIZE}
            style={[styles.heart]}
          />
          <TouchableWithoutFeedback
            onPress={() => {
              ToastAndroid.show("Dots!", ToastAndroid.SHORT);
            }}>
            <View style={styles.dotsContainer}>
              <DotsView color={COLORS.white} />
            </View>
          </TouchableWithoutFeedback>
          <View style={[styles.container]}>
            <View style={styles.content}>
              <View
                style={{
                  width: "54%",
                }}>
                <Text numberOfLines={1} style={[styles.title]}>
                  {name}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: "center",
    top: 16 * ratio,
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.6,
    color: COLORS.white,
    textAlign: "center",
  },
  heart: {
    color: COLORS.green,
    position: "absolute",
    justifyContent: "center",
    textAlignVertical: "center",
    top: 8,
    zIndex: 1,
    right: 54,
    padding: 10,
  },
  arrowIcon: {
    color: COLORS.white,
    position: "absolute",
    left: 15,
    justifyContent: "center",
    textAlignVertical: "center",
    top: 8,
    zIndex: 1,
    padding: 10,
  },
  dotsContainer: {
    position: "absolute",
    right: 15,
    justifyContent: "center",
    alignItems: "center",
    top: 8,
    zIndex: 1,
    padding: 14,
  },
});

export default DetailsHeader;
