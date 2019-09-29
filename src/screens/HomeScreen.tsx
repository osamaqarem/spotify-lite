import React from "react";
import {ScrollView, Text, View, Image, StyleSheet} from "react-native";
import TopBar from "../components/TopBar";
import {COLORS} from "../utils/_vars";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {recentlyPlayed} from "../data/home";

const ROW_SCROLLVIEW_HEIGHT = 170;
const ALBUM_DIMEN = ROW_SCROLLVIEW_HEIGHT - 28;

const settingsIcon = (
  <MaterialCommunityIcon
    name="settings-outline"
    size={24}
    color={COLORS.icon}
    style={{position: "absolute", right: 10}}
  />
);

const renderAlbum = (album: any, index: number) => {
  return (
    <View key={index} style={{marginHorizontal: 8, flexDirection: "column"}}>
      <Image
        source={album.img}
        style={{
          height: ALBUM_DIMEN,
          width: ALBUM_DIMEN,
        }}></Image>
      <Text
        style={{
          fontSize: 13,
          alignSelf: "center",
          top: 5,
          color: "white",
          fontWeight: "bold",
        }}>
        {album.title}
      </Text>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <TopBar>
        <Text style={styles.barHeader}>Home</Text>
        {settingsIcon}
      </TopBar>
      <ScrollView style={{width: "100%"}} showsVerticalScrollIndicator={false}>
        <View style={styles.columnScrollContainer}>
          <Text style={styles.subheader}>Recently played</Text>
        </View>
        <ScrollView
          overScrollMode="never"
          style={{height: ROW_SCROLLVIEW_HEIGHT}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <View style={styles.rowScrollContainer}>
            {recentlyPlayed.map((album, index) => renderAlbum(album, index))}
          </View>
        </ScrollView>
        <Text style={[styles.subheader, {marginTop: 50}]}>Made for you</Text>
        <Text style={{fontSize: 40, color: "white"}}>asdasdsad</Text>

        <Text style={{fontSize: 40, color: "white"}}>asdasdsad</Text>
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
  columnScrollContainer: {marginTop: 20, marginBottom: 10},
  rowScrollContainer: {flexDirection: "row", marginLeft: 9},
  subheader: {
    alignSelf: "center",
    color: "white",
    fontSize: 18.5,
    fontWeight: "bold",
  },
});

export default HomeScreen;
