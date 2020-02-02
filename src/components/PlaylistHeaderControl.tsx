import React from "react";
import { ToastAndroid, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../utils/constants";
import DotsView from "./DotsView";
import BackBtn from "./BackBtn";
import UIHelper from "../utils/helpers/UIHelper";

const PlaylistHeaderControl = ({
  goBack,
  isLoading,
}: {
  goBack: () => void;
  isLoading: boolean;
}) => {
  return (
    <>
      <BackBtn goBack={goBack} />
      {!isLoading && (
        <>
          <Icon
            onPress={() => {
              ToastAndroid.show("Heart!", ToastAndroid.SHORT);
            }}
            name={true ? "heart" : "heart-outline"}
            size={28}
            style={[
              {
                color: COLORS.green,
                position: "absolute",
                top: UIHelper.isIphoneX() ? 50 : 10,
                padding: 12,
                right: 34,
                zIndex: 1,
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
              },
            ]}
          />
          <View
            style={{
              position: "absolute",
              top: UIHelper.isIphoneX() ? 50 : 10,
              right: 0,
              paddingTop: 10,
              zIndex: 1,
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}>
            <TouchableWithoutFeedback
              style={{
                padding: 18,
                bottom: 10,
              }}
              onPress={() => {
                ToastAndroid.show("Dots!", ToastAndroid.SHORT);
              }}>
              <DotsView color={COLORS.white} />
            </TouchableWithoutFeedback>
          </View>
        </>
      )}
    </>
  );
};
export default PlaylistHeaderControl;
