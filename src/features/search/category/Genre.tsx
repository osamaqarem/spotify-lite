import React, { useLayoutEffect, useReducer } from "react";
import { Platform, StatusBar, Text, View } from "react-native";
// @ts-ignore
import { colorsFromUrl } from "react-native-dominant-color";
import LinearGradient from "react-native-linear-gradient";
import { NavigationEvents, SafeAreaView, ScrollView } from "react-navigation";
import { NavigationStackProp } from "react-navigation-stack";
import { connect, ConnectedProps } from "react-redux";
import BackBtn from "../../../components/BackBtn";
import { RootStoreType } from "../../../redux/store";
import { COLORS, height } from "../../../utils";
import AlbumItem from "../../home/AlbumItem";
import GenrePlaylistItem from "./GenrePlaylistItem";
import SeeMoreBtn from "./SeeMoreBtn";

const initialState = {
  dominantColor: COLORS.tabBar,
  loading: true,
};

const Genre = ({
  navigation,
  genrePlaylists,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const [state, setState] = useReducer(
    // eslint-disable-next-line
    (state = initialState, payload: typeof initialState) => ({ ...payload }),
    initialState,
  );

  useLayoutEffect(() => {
    if (Platform.OS === "android") {
      genrePlaylists[0].imageUrl &&
        colorsFromUrl(genrePlaylists[0].imageUrl, (err: any, colors: any) => {
          if (!err) {
            setState({
              dominantColor: colors.averageColor,
              loading: false,
            });
          }
        });
    } else {
      setState({
        dominantColor: "pink",
        loading: false,
      });
    }
  }, [genrePlaylists]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: state.dominantColor,
      }}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle("light-content");
        }}
      />
      <BackBtn goBack={navigation.goBack} />

      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.9 }}
        colors={[state.dominantColor, COLORS.background]}
        style={{
          height: "40%",
          width: "100%",
          // position: "absolute",
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
        Pop
      </Text>
      <View
        style={{
          backgroundColor: COLORS.background,
          flex: 1,
        }}>
        <ScrollView style={{}}>
          <Text
            style={{
              alignSelf: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 18.5,
            }}>
            Popular Playlists
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              marginHorizontal: 15,
              marginBottom: 38,
            }}>
            {[0, 1, 2, 3].map((album: any, index: number) => (
              <GenrePlaylistItem
                key={album.id}
                {...{
                  playlist: {
                    name: "It's a Hit!",
                    imageUrl: "https://i.imgur.com/HsIT8.jpg",
                    followerCount: 27213142,
                    ownerName: "Spotify",
                    tracks: [],
                  },
                  index,
                  onPress: () => {
                    return;
                  },
                }}
              />
            ))}
          </View>
          <SeeMoreBtn />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  genrePlaylists: state.browseReducer.genrePlaylists,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Genre);
