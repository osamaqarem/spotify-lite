import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../utils";
import TopBar from "../common/TopBar";
import LoginModal, { LoginModalType } from "./LoginModal";

const ROW_SCROLLVIEW_HEIGHT = 180;
const ALBUM_DIMEN_RECENT = ROW_SCROLLVIEW_HEIGHT - 38;

const ALBUM_DIMEN_MADE = 172.5;

type HomeType = {
  data: {
    madeForYou: any;
    isVisible: boolean;
    recentlyPlayed: any;
    recommendedForYou: any;
    loginModalProps: LoginModalType;
    recentlyPlayedAlbums: [{ name: string; url: string }];
    featuredPlaylists: [{ name: string; url: string }];
    userTopArtists: [{ name: string; url: string }];
    userTopArtistsHeader: { name: string; url: string };
  };
};

const settingsIcon = (
  <MaterialCommunityIcon
    name="settings-outline"
    size={24}
    color={COLORS.icon}
    style={{ position: "absolute", right: 10 }}
  />
);

const renderAlbumRecent = (
  album: { name: string; url: string },
  index: number,
) => {
  return (
    <View key={index} style={{ marginHorizontal: 8, flexDirection: "column" }}>
      <FastImage
        source={{
          uri: album.url,
        }}
        style={{
          height: ALBUM_DIMEN_RECENT,
          width: ALBUM_DIMEN_RECENT,
        }}
      />
      <View
        style={{
          width: 140,
          top: 5,
          alignSelf: "center",
        }}>
        <Text
          numberOfLines={2}
          style={[
            styles.centeredText,
            {
              fontSize: 13,
              textAlign: "center",
            },
          ]}>
          {album.name}
        </Text>
      </View>
    </View>
  );
};

const renderAlbum = (
  album: {
    name: string;
    url: string;
  },
  index: number,
) => {
  return (
    <View key={index} style={[{ width: ALBUM_DIMEN_MADE }]}>
      <FastImage
        source={{
          uri: album.url,
        }}
        style={{
          height: ALBUM_DIMEN_MADE,
          width: ALBUM_DIMEN_MADE,
          marginTop: 20,
        }}
      />
      <Text numberOfLines={2} style={[styles.centeredText, styles.albumText]}>
        {album.name}
      </Text>
    </View>
  );
};

const Home = ({ data }: HomeType) => {
  return (
    <View style={styles.container}>
      {data.isVisible ? <LoginModal {...data.loginModalProps} /> : null}
      <TopBar>
        <Text style={styles.barHeader}>Home</Text>
        {settingsIcon}
      </TopBar>
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.centeredText,
            styles.headerText,
            { fontSize: 18.5, marginTop: 20, marginBottom: 10 },
          ]}>
          Recently played
        </Text>
        <ScrollView
          overScrollMode="never"
          style={{ height: ROW_SCROLLVIEW_HEIGHT }}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View style={styles.rowScrollContainer}>
            {data.recentlyPlayedAlbums.map((album, index: number) =>
              renderAlbumRecent(album, index),
            )}
          </View>
        </ScrollView>
        <Text
          style={[styles.centeredText, styles.headerText, { marginTop: 50 }]}>
          Featured playlists
        </Text>
        <View style={styles.content}>
          {data.featuredPlaylists.map((album, index: number) =>
            renderAlbum(album, index),
          )}
        </View>
        <Text
          style={[styles.centeredText, styles.headerText, { marginTop: 30 }]}>
          Your top artists
        </Text>
        <View
          style={[
            {
              width: ALBUM_DIMEN_MADE + 70,
              alignSelf: "center",
            },
          ]}>
          <FastImage
            source={{
              uri: data.userTopArtistsHeader.url,
            }}
            style={{
              height: ALBUM_DIMEN_MADE + 70,
              width: ALBUM_DIMEN_MADE + 70,
              marginTop: 20,
            }}
          />
          <Text
            numberOfLines={2}
            style={[
              styles.centeredText,
              styles.albumText,
              { marginBottom: 25, fontSize: 15 },
            ]}>
            {data.userTopArtistsHeader.name}
          </Text>
        </View>
        <View style={styles.content}>
          {data.userTopArtists.map((album: any, index: number) =>
            renderAlbum(album, index),
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  barHeader: {
    color: "white",
    alignSelf: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  columnScrollContainer: {},
  rowScrollContainer: { flexDirection: "row", marginLeft: 9 },
  centeredText: {
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 18.5,
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginBottom: 38,
  },
  albumText: {
    width: "94%",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "normal",
    color: "#B8B8B8",
    top: 10,
    fontSize: 13,
  },
});

export default Home;
