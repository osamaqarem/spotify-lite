import React, { ReactNode } from "react";
import { Text, View, ScrollView } from "react-native";
import { albumDimensions, styles } from "./styles";

const RecentlyPlayed = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Text
        style={[
          styles.centeredText,
          styles.headerText,
          { fontSize: 18.5, marginTop: 20, marginBottom: 10 },
        ]}>
        Recently played
      </Text>
      <ScrollView
        overScrollMode="never"
        style={{ height: albumDimensions.ROW_SCROLLVIEW_HEIGHT }}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <View style={styles.rowScrollContainer}>{children}</View>
      </ScrollView>
    </>
  );
};

export default RecentlyPlayed;
