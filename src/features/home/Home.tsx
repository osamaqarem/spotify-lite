import React from "react"
import { ScrollView, StatusBar, View } from "react-native"
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../../common/theme"
import TopBar from "../../common/components/TopBar"
import FeaturedPlaylists from "./components/FeaturedPlaylists"
import RecentlyPlayed from "./components/RecentlyPlayed"
import { styles } from "./styles"
import TopArtists from "./components/TopArtists"
import { SafeAreaView, NavigationEvents } from "react-navigation"
import { PLAYER_HEIGHT } from "../player/StickyPlayer"

const Home = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.tabBar }}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle("light-content")
        }}
      />
      <View style={styles.container}>
        <StatusBar
          backgroundColor={colors.background}
          barStyle="light-content"
        />
        <TopBar title="Home">
          <MaterialCommunityIcon
            name="settings-outline"
            size={24}
            color={colors.itemInactive}
            style={{ position: "absolute", right: 10 }}
          />
        </TopBar>
        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: PLAYER_HEIGHT }}
          showsVerticalScrollIndicator={false}>
          <RecentlyPlayed />
          <FeaturedPlaylists />
          <TopArtists />
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Home
