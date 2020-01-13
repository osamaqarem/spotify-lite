import React, { useLayoutEffect, useReducer, useRef, useState } from "react";
import {
  BackHandler,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { NavigationEvents, SafeAreaView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import BackBtn from "../../../components/BackBtn";
import LoadingView from "../../../components/LoadingView";
import {
  clearCategoryPlaylists,
  getCategoryById,
  setPlaylistDetails,
} from "../../../redux/actions";
import { RootStoreType } from "../../../redux/reducers";
import { GenrePlaylist } from "../../../redux/reducers/browseReducer";
import { COLORS, Routes } from "../../../utils";
import ListOfGenrePlaylists from "./ListOfGenrePlaylists";

const AnimatedLinearGradient: typeof LinearGradient = Animated.createAnimatedComponent(
  LinearGradient,
);

const initialState = {
  dominantColor: COLORS.tabBar,
  loading: true,
};

const Genre = ({
  navigation,
  genreDetails,
  clearCategoryPlaylists,
  setPlaylistDetails,
  getCategoryById,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current;

  const heightAnim = offsetY.interpolate({
    inputRange: [0, 150],
    outputRange: [40, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const { genrePlaylists, title, id } = genreDetails;
  const [seeMoreVisible, setSeeMoreVisible] = useState(true);

  const [{ loading, dominantColor }, setState] = useReducer(
    // eslint-disable-next-line
    (state = initialState, payload: typeof initialState) => ({ ...payload }),
    initialState,
  );

  useLayoutEffect(() => {
    if (genrePlaylists[0]?.imageUrl) {
      if (Platform.OS === "android") {
        colorsFromUrl(genrePlaylists[0].imageUrl, (err: any, colors: any) => {
          if (!err) {
            setState({
              dominantColor: colors.dominantColor,
              loading: false,
            });
          }
        });
      } else {
        setState({
          dominantColor: COLORS.tabBar,
          loading: false,
        });
      }
    }
  }, [genrePlaylists]);

  function handleBack() {
    setTimeout(() => {
      clearCategoryPlaylists();
    }, 500);

    navigation.goBack();
    BackHandler.removeEventListener("hardwareBackPress", handleBack);
    // This function is also the backhandler for android. So we return true.
    return true;
  }

  const handleSeeMore = () => {
    setSeeMoreVisible(false);
    getCategoryById({
      title: title!,
      id: id!,
      getRestOfItems: true,
    });
  };

  const onPlaylistPressed = (playlist: GenrePlaylist) => {
    setPlaylistDetails(playlist);
    navigation.navigate(Routes.AppTabs.ExploreStack.PlaylistDetails);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}>
      <NavigationEvents
        onWillFocus={() => StatusBar.setBarStyle("light-content")}
        onDidFocus={() =>
          BackHandler.addEventListener("hardwareBackPress", handleBack)
        }
      />
      <BackBtn goBack={handleBack} />
      {(loading && <LoadingView viewStyle={{ marginTop: 50 }} />) || (
        <>
          <AnimatedLinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.9 }}
            colors={[dominantColor, COLORS.background]}
            // @ts-ignore
            style={{
              height: Animated.concat(heightAnim, "%"),
              width: "100%",
              top: 0,
              opacity: 1,
              ...StyleSheet.absoluteFillObject,
            }}
          />
          <Text
            style={{
              position: "absolute",
              top: "25%",
              color: COLORS.white,
              fontSize: 40,
              fontWeight: "bold",
            }}>
            {title}
          </Text>
          <ListOfGenrePlaylists
            genrePlaylists={genrePlaylists}
            handleSeeMore={handleSeeMore}
            offsetY={offsetY}
            onPlaylistPressed={onPlaylistPressed}
            seeMoreVisible={seeMoreVisible}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  genreDetails: state.browseReducer.genreDetails,
});

const mapDispatchToProps = {
  clearCategoryPlaylists,
  setPlaylistDetails,
  getCategoryById,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Genre);
