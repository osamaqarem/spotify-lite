import React from "react";
import { ScrollView, StatusBar, View } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../utils";
import TopBar from "../../components/TopBar";
import FeaturedPlaylists from "./FeaturedPlaylists";
import RecentlyPlayed from "./RecentlyPlayed";
import { styles } from "./styles";
import TopArtists from "./TopArtists";
import { SafeAreaView, NavigationEvents } from "react-navigation";

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.tabBar }}>
      <NavigationEvents
        onDidFocus={() => {
          StatusBar.setBarStyle("light-content");
        }}
      />
      <View style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="light-content"
        />
        <TopBar title="Home">
          <MaterialCommunityIcon
            name="settings-outline"
            size={24}
            color={COLORS.itemInactive}
            style={{ position: "absolute", right: 10 }}
          />
        </TopBar>
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}>
          <RecentlyPlayed />
          <FeaturedPlaylists />
          <TopArtists />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
