import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
// @ts-ignore
import LinearGradient from "react-native-linear-gradient";
import Animated from "react-native-reanimated";
import { NavigationEvents, SafeAreaView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import ArtistCover from "../../components/ArtistCover";
import DetailsCover from "../../components/DetailsCover";
import ListOfTracks from "../../components/ListOfTracks";
import PlaylistHeaderControl from "../../components/PlaylistHeaderControl";
import PlaylistTitle, { HEADER_HEIGHT } from "../../components/PlaylistTitle";
import ShuffleButton from "../../components/ShuffleButton";
import { RootStoreType } from "../../data/models/redux";
import usePlaylistAnim from "../../hooks/usePlaylistAnim";
import { redoLogin, setArtistId } from "../../redux/actions";
import { COLORS, Routes } from "../../utils/constants";
import UIHelper from "../../utils/helpers/UIHelper";
import useArtistDetails from "./useArtistDetails";

const LoadingView = () => (
  <ActivityIndicator
    size={50}
    color={COLORS.green}
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  />
);

const ArtistDetails = ({
  artistId,
  setArtistId,
  navigation,
  token,
  profile,
  redoLogin,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current;
  const { heightAnim, opacityAnim, translateAnim } = usePlaylistAnim(offsetY);
  const [scrollViewHeight, setScrollViewHeight] = useState<number>(100);
  const { isLoading, dominantColor, artistDetails } = useArtistDetails({
    artistId,
    profile,
    redoLogin,
    token,
  });

  const goToArtist = (id: string) => {
    setArtistId(id);
    navigation.push(Routes.BottomTabs.HomeStack.ArtistDetails);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <NavigationEvents
        onWillFocus={() => StatusBar.setBarStyle("light-content")}
      />
      <PlaylistHeaderControl
        goBack={() => navigation.goBack()}
        isLoading={isLoading}
      />
      {isLoading ? (
        <LoadingView />
      ) : (
        <>
          <PlaylistTitle name={artistDetails?.name} />
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
              // end={{ x: 0, y: 0.9 }}
              end={{ x: 0, y: 0.7 }}
              colors={[dominantColor, COLORS.background]}
              style={styles.gradient}
            />
          </Animated.View>
          <View style={styles.coverContainer}>
            <DetailsCover
              coverShape="CIRCLE"
              offsetY={offsetY}
              name={artistDetails?.name}
              imageUrl={artistDetails?.imageUrl}
              artistName={artistDetails?.ownerName}
              username={profile?.display_name}
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
            onScroll={UIHelper.onScroll({ y: offsetY })}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={1}
            style={[{ transform: [{ translateY: translateAnim }] }]}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: scrollViewHeight * 0.85,
              },
            ]}>
            {artistDetails && (
              <ListOfTracks
                playlistDetails={artistDetails}
                showDownload={false}
              />
            )}
            <Text style={[styles.relatedArtists]}>Related artists</Text>
            {artistDetails && (
              <ScrollView
                horizontal
                style={{
                  marginTop: 12,
                }}
                contentContainerStyle={{
                  paddingBottom: 30,
                }}
                showsVerticalScrollIndicator={false}>
                {artistDetails.relatedArtists.map(artist => (
                  <ArtistCover
                    coverShape="CIRCLE"
                    key={artist.id}
                    onPress={() => goToArtist(artist.id)}
                    album={{
                      id: artist.id,
                      name: artist.name,
                      imageURL: artist.imageURL,
                    }}
                  />
                ))}
              </ScrollView>
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
    marginTop: UIHelper.isIphoneX() ? -10 : -50,
    top: HEADER_HEIGHT,
  },
  scrollContent: {
    marginTop: 350,
    zIndex: 5,
  },
  relatedArtists: {
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 18.5,
    marginTop: 24,
  },
});

const mapStateToProps = (state: RootStoreType) => ({
  artistId: state.artistReducer.artistId,
  token: state.userReducer.token,
  profile: state.userReducer.profile,
});

const mapDispatchToProps = {
  setArtistId,
  redoLogin,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ArtistDetails);
