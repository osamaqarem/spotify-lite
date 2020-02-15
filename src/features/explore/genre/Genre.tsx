import React, { useLayoutEffect, useReducer, useRef, useState } from "react";
import { Platform, StatusBar, StyleSheet, Text } from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { NavigationEvents, SafeAreaView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import BackBtn from "../../../components/BackBtn";
import LoadingView from "../../../components/LoadingView";
import { getCategoryById, setPlaylistDetails } from "../../../redux/actions";
import { RootStoreType } from "../../../data/models/redux";
import { COLORS, Routes } from "../../../utils/constants";
import ListOfGenrePlaylists from "./components/ListOfGenrePlaylists";
import { PlaylistDetailsType } from "../../../redux/reducers/playlistReducer";

const AnimatedLinearGradient: typeof LinearGradient = Animated.createAnimatedComponent(
  LinearGradient,
);

const initialState = {
  dominantColor: COLORS.tabBar,
  loadingColor: true,
};

const Genre = ({
  navigation,
  genreDetails,
  setPlaylistDetails,
  getCategoryById,
  loadingData,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current;

  const heightAnim = offsetY.interpolate({
    inputRange: [0, 150],
    outputRange: [40, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  const { genrePlaylists, title, id } = genreDetails;
  const [seeMoreVisible, setSeeMoreVisible] = useState(true);

  const [{ loadingColor, dominantColor }, setState] = useReducer(
    // eslint-disable-next-line
    (state = initialState, payload: typeof initialState) => ({ ...payload }),
    initialState,
  );

  useLayoutEffect(() => {
    if (
      loadingColor &&
      genrePlaylists[0]?.imageUrl &&
      Platform.OS === "android"
    ) {
      colorsFromUrl(genrePlaylists[0].imageUrl, (err: any, colors: any) => {
        if (!err) {
          setState({
            dominantColor: colors.dominantColor,
            loadingColor: false,
          });
        }
      });
    } else {
      setState({
        dominantColor: COLORS.tabBar,
        loadingColor: false,
      });
    }
  }, [genrePlaylists, loadingColor]);

  const handleSeeMore = () => {
    setSeeMoreVisible(false);
    getCategoryById({
      title: title!,
      id: id!,
      getRestOfItems: true,
    });
  };

  const onPlaylistPressed = (playlist: PlaylistDetailsType) => {
    setPlaylistDetails(playlist);
    navigation.navigate(Routes.BottomTabs.ExploreStack.PlaylistDetails);
  };

  const handleWillFocus = () => {
    StatusBar.setBarStyle("light-content");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationEvents onWillFocus={handleWillFocus} />
      <BackBtn goBack={handleBack} />
      {((loadingData || loadingColor) && (
        <LoadingView viewStyle={styles.loading} />
      )) || (
        <>
          <AnimatedLinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.9 }}
            colors={[dominantColor, COLORS.background]}
            // @ts-ignore
            style={[
              {
                height: Animated.concat(heightAnim, "%"),
              },
              styles.gradient,
            ]}
          />
          <Text style={styles.title}>{title}</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  gradient: { width: "100%", opacity: 1, ...StyleSheet.absoluteFillObject },
  title: {
    position: "absolute",
    top: "25%",
    color: COLORS.white,
    fontSize: 40,
    fontWeight: "bold",
  },
  loading: { marginTop: 50 },
});

const mapStateToProps = (state: RootStoreType) => ({
  genreDetails: state.browseReducer.genreDetails,
  loadingData: state.browseReducer.isLoading,
});

const mapDispatchToProps = {
  setPlaylistDetails,
  getCategoryById,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Genre);
