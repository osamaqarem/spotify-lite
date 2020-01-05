import React, {
  useLayoutEffect,
  useReducer,
  useState,
  useMemo,
  useCallback,
} from "react";
import { BackHandler, Platform, StatusBar, Text } from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
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
  const { genrePlaylists, title, id } = genreDetails;
  const [seeMoreVisible, setSeeMoreVisible] = useState(true);

  const [state, setState] = useReducer(
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

  const handleSeeMore = useCallback(() => {
    setSeeMoreVisible(false);
    getCategoryById({
      title: title!,
      id: id!,
      getRestOfItems: true,
    });
  }, [getCategoryById, id, title]);

  const handlePlaylistPress = useCallback(
    (playlist: GenrePlaylist) => {
      setPlaylistDetails(playlist);
      navigation.navigate(Routes.AppTabs.SearchStack.PlaylistDetails);
    },
    [navigation, setPlaylistDetails],
  );

  const memoizedList = useMemo(
    () => (
      <ListOfGenrePlaylists
        {...{
          handlePlaylistPress,
          handleSeeMore,
          genrePlaylists,
          seeMoreVisible,
        }}
      />
    ),
    [handlePlaylistPress, handleSeeMore, genrePlaylists, seeMoreVisible],
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:
          (state.loading && COLORS.background) || state.dominantColor,
      }}>
      <NavigationEvents
        onWillFocus={() => StatusBar.setBarStyle("light-content")}
        onDidFocus={() =>
          BackHandler.addEventListener("hardwareBackPress", handleBack)
        }
      />
      <BackBtn goBack={handleBack} />
      {(state.loading && <LoadingView viewStyle={{ marginTop: 50 }} />) || (
        <>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.9 }}
            colors={[state.dominantColor, COLORS.background]}
            style={{
              height: "40%",
              width: "100%",
              top: 0,
              opacity: 1,
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
          {memoizedList}
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
