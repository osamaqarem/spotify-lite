import React from "react";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";

const Cover = ({ uri }: { uri: string }) => {
  return (
    <FastImage
      source={{
        uri,
      }}
      style={styles.cover}
    />
  );
};

const styles = StyleSheet.create({
  cover: {
    height: 50,
    width: 50,
  },
});

export default Cover;
