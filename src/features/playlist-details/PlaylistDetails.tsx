import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  BackHandler,
  Platform,
  StyleSheet,
  View,
  StatusBar,
} from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { SafeAreaView, NavigationEvents } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import DetailsCover from "../../components/DetailsCover";
import ListOfTracks from "../../components/ListOfTracks";
import LoadingView from "../../components/LoadingView";
import PlaylistHeaderControl from "../../components/PlaylistHeaderControl";
import PlaylistTitle from "../../components/PlaylistTitle";
import ShuffleButton from "../../components/ShuffleButton";
import usePlaylistAnim from "../../hooks/usePlaylistAnim";
import { clearPlaylistDetails } from "../../redux/actions";
import { RootStoreType } from "../../redux/types";
import { COLORS, onScroll } from "../../utils";

const PlaylistDetails = ({
  playlistDetails,
  clearPlaylistDetails,
  navigation,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current;
  const { heightAnim, opacityAnim, translateAnim } = usePlaylistAnim(offsetY);
  const [dominantColor, setDominantColor] = useState(COLORS.background);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollViewHeight, setScrollViewHeight] = useState<number>(100);

  const goBack = useCallback(() => {
    clearPlaylistDetails();
    navigation.goBack();
    return true;
  }, [clearPlaylistDetails, navigation]);

  useLayoutEffect(() => {
    const didFocusSub = navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", goBack);

      if (playlistDetails?.imageUrl) {
        if (Platform.OS === "android") {
          colorsFromUrl(playlistDetails?.imageUrl, (err: any, colors: any) => {
            if (!err) {
              setDominantColor(colors.averageColor);
              setIsLoading(false);
            }
          });
        } else {
          setDominantColor(COLORS.tabBar);
          setIsLoading(false);
        }
      }
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", goBack);
      didFocusSub.remove();
    };
  }, [goBack, navigation, playlistDetails]);

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.background, flex: 1 }}>
      <NavigationEvents
        onWillFocus={() => StatusBar.setBarStyle("light-content")}
      />
      <PlaylistHeaderControl goBack={goBack} isLoading={isLoading} />
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <PlaylistTitle name={playlistDetails?.name} />
          <Animated.View
            style={[
              styles.gradientContainer,
              {
                height: Animated.concat(heightAnim, "%"),
                opacity: opacityAnim,
              },
            ]}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.7 }}
              colors={[dominantColor, COLORS.background]}
              style={styles.gradient}
            />
          </Animated.View>
          <View style={styles.coverContainer}>
            <DetailsCover
              coverShape="SQUARE"
              offsetY={offsetY}
              name={playlistDetails?.name}
              imageUrl={playlistDetails?.imageUrl}
              artistName={playlistDetails?.ownerName}
            />
          </View>
          <ShuffleButton
            offsetY={offsetY}
            scrollViewHeight={scrollViewHeight}
          />
          <Animated.ScrollView
            onLayout={e => setScrollViewHeight(e.nativeEvent.layout.height)}
            bounces={false}
            decelerationRate={0.994}
            overScrollMode="never"
            onScroll={onScroll({ y: offsetY })}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            style={[
              {
                transform: [{ translateY: translateAnim }],
              },
            ]}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: scrollViewHeight,
              },
            ]}>
            {playlistDetails && (
              <ListOfTracks playlistDetails={playlistDetails} showDownload />
            )}
          </Animated.ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    alignSelf: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    alignSelf: "center",
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
  },
  coverContainer: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 90,
  },
  scrollContent: {
    marginTop: 350,
    zIndex: 5,
  },
});

const mapStateToProps = (state: RootStoreType) => ({
  playlistDetails: state.playlistReducer.playlistDetails,
});

const mapDispatchToProps = {
  clearPlaylistDetails,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(PlaylistDetails);
