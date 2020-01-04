import React from "react";
import { SafeAreaView } from "react-navigation";
import { MaterialTopTabBar } from "react-navigation-tabs";
import { connect } from "react-redux";
import { RootStoreType } from "../../../redux/reducers";

const HideableMaterialTopTabBar = (props: any) => {
  const { showTabBar } = props;

  return (
    <SafeAreaView style={{ position: showTabBar ? "relative" : "absolute" }}>
      <MaterialTopTabBar {...props} />
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  showTabBar: state.themeReducer.showTabBar,
});

export default connect(mapStateToProps, {})(HideableMaterialTopTabBar);
