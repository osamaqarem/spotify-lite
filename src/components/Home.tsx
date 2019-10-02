import React from "react";
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import TopBar from "../components/TopBar";
import {recommendedForYouHeader} from "../data/home";
import {COLORS} from "../utils/_vars";
import LoginModal, {LoginModalType} from "./LoginModal";

const ROW_SCROLLVIEW_HEIGHT = 170;
const ALBUM_DIMEN_RECENT = ROW_SCROLLVIEW_HEIGHT - 28;

const ALBUM_DIMEN_MADE = 172.5;

type HomeType = {
  data: {
    madeForYou: any;
    recentlyPlayed: any;
    recommendedForYou: any;
    loginModalProps: LoginModalType;
  };
};

const settingsIcon = (
  <MaterialCommunityIcon
    name="settings-outline"
    size={24}
    color={COLORS.icon}
    style={{position: "absolute", right: 10}}
  />
);

const renderAlbumRecent = (album: any, index: number) => {
  return (
    <View key={index} style={{marginHorizontal: 8, flexDirection: "column"}}>
      <Image
        source={album.img}
        style={{
          height: ALBUM_DIMEN_RECENT,
          width: ALBUM_DIMEN_RECENT,
        }}
      />
      <Text
        style={[
          styles.centeredText,
          {
            fontSize: 13,
            top: 5,
          },
        ]}>
        {album.title}
      </Text>
    </View>
  );
};

const renderAlbum = (album: any, index: number) => {
  return (
    <View key={index} style={[{width: ALBUM_DIMEN_MADE}]}>
      <Image
        source={album.img}
        style={{
          height: ALBUM_DIMEN_MADE,
          width: ALBUM_DIMEN_MADE,
          marginTop: 20,
        }}
      />
      <Text numberOfLines={2} style={[styles.centeredText, styles.albumText]}>
        {album.title}
      </Text>
    </View>
  );
};

const Home = ({data}: HomeType) => {
  return (
    <View style={styles.container}>
      <LoginModal {...data.loginModalProps} />
      <TopBar>
        <Text style={styles.barHeader}>Home</Text>
        {settingsIcon}
      </TopBar>
      <ScrollView style={{width: "100%"}} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.centeredText,
            styles.headerText,
            {fontSize: 18.5, marginTop: 20, marginBottom: 10},
          ]}>
          Recently played
        </Text>
        <ScrollView
          overScrollMode="never"
          style={{height: ROW_SCROLLVIEW_HEIGHT}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View style={styles.rowScrollContainer}>
            {data.recentlyPlayed.map((album: any, index: number) =>
              renderAlbumRecent(album, index),
            )}
          </View>
        </ScrollView>
        <Text style={[styles.centeredText, styles.headerText, {marginTop: 50}]}>
          Made for you
        </Text>
        <View style={styles.content}>
          {data.madeForYou.map((album: any, index: number) =>
            renderAlbum(album, index),
          )}
        </View>
        <Text style={[styles.centeredText, styles.headerText, {marginTop: 30}]}>
          Recommended for you
        </Text>
        <View
          style={[
            {
              width: ALBUM_DIMEN_MADE + 70,
              alignSelf: "center",
            },
          ]}>
          <Image
            source={recommendedForYouHeader.img}
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
              {marginBottom: 25, fontSize: 15},
            ]}>
            {recommendedForYouHeader.title}
          </Text>
        </View>
        <View style={styles.content}>
          {data.recommendedForYou.map((album: any, index: number) =>
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
  rowScrollContainer: {flexDirection: "row", marginLeft: 9},
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
