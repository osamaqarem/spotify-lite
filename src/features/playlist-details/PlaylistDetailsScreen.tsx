import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ActivityIndicator, BackHandler, StyleSheet, View } from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import DetailsCover from "../../components/DetailsCover";
import DetailsHeader, { HEADER_HEIGHT } from "../../components/DetailsHeader";
import ListOfTracks from "../../components/ListOfTracks";
import ShuffleButton from "../../components/ShuffleButton";
import usePlaylistAnim from "../../hooks/usePlaylistAnim";
import { clearPlaylistDetails } from "../../redux/actions";
import { RootStoreType } from "../../redux/store";
import { COLORS, height, ratio } from "../../utils";

const onScroll = (contentOffset: {
  x?: Animated.Node<number>;
  y?: Animated.Node<number>;
}) =>
  Animated.event([
    {
      nativeEvent: {
        contentOffset,
      },
    },
  ]);

const LoadingView = () => (
  <ActivityIndicator
    size={50}
    color={COLORS.green}
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  />
);

const PlaylistDetailsScreen = ({
  playlistDetails,
  clearPlaylistDetails,
  navigation,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current;
  const { heightAnim, opacityAnim, translateAnim } = usePlaylistAnim(offsetY);
  const [dominantColor, setDominantColor] = useState(COLORS.background);
  const [isLoading, setIsLoading] = useState(true);

  const goBack = useCallback(() => {
    clearPlaylistDetails();
      navigation.goBack();
    return true;
  }, [clearPlaylistDetails, navigation]);

  useLayoutEffect(() => {
    const didFocusSub = navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", goBack);

      playlistDetails?.imageUrl &&
        colorsFromUrl(playlistDetails?.imageUrl, (err: any, colors: any) => {
          if (!err) {
            setDominantColor(colors.averageColor);
            setIsLoading(false);
          }
        });
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", goBack);
      didFocusSub.remove();
    };
  }, [goBack, navigation, playlistDetails?.imageUrl]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <DetailsHeader
        name={playlistDetails?.name}
        goBack={goBack}
        isLoading={isLoading}
      />
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
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
              end={{ x: 0, y: 0.9 }}
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
          <ShuffleButton offsetY={offsetY} />
          <Animated.ScrollView
            bounces={false}
            decelerationRate={0.994}
            overScrollMode="never"
            onScroll={onScroll({ y: offsetY })}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            style={[{ transform: [{ translateY: translateAnim }] }]}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom:
                  playlistDetails && playlistDetails.tracks.length > 8
                    ? 364 * ratio
                    : height,
              },
            ]}>
            {playlistDetails && (
              <ListOfTracks playlistDetails={playlistDetails} showDownload />
            )}
          </Animated.ScrollView>
        </>
      )}
    </View>
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
    height: "60%",
    top: HEADER_HEIGHT,
  },
  scrollContent: {
    marginTop: 290 * ratio,
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

export default connector(PlaylistDetailsScreen);
