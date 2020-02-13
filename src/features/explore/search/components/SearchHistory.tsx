import React from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";
import { AlbumType } from "../../../../data/models/spotify";
import { COLORS } from "../../../../utils/constants";
import UIHelper from "../../../../utils/helpers/UIHelper";
import HistoryRow from "./HistoryRow";

const clock = new Animated.Clock();
const opacityAnim = UIHelper.opacityTiming(clock, 0.5, 1, 250);

const SearchHistory = React.memo(
  ({
    queryHistory,
    handleRemove,
  }: {
    queryHistory: AlbumType[];
    handleRemove: (item: AlbumType) => void;
  }) => {
    return (
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
          opacity: opacityAnim,
        }}>
        <Text
          style={{
            marginTop: 20,
            marginBottom: 8,
            fontWeight: "bold",
            fontSize: 18,
            color: COLORS.white,
            letterSpacing: 0.6,
            textAlign: "center",
          }}>
          Recent searches
        </Text>
        {queryHistory.map(item => (
          <HistoryRow item={item} key={item.id} handleRemove={handleRemove} />
        ))}
      </Animated.View>
    );
  },
);

SearchHistory.displayName = "SearchHistory";

export default SearchHistory;
