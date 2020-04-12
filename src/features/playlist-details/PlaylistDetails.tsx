import React, { useCallback, useLayoutEffect, useRef, useState } from "react"
import { BackHandler, StatusBar, StyleSheet, View } from "react-native"
import ImageColors from "react-native-image-colors"
import LinearGradient from "react-native-linear-gradient"
import Animated from "react-native-reanimated"
import { NavigationEvents, SafeAreaView } from "react-navigation"
import { NavigationStackProp } from "react-navigation-stack"
import { connect, ConnectedProps } from "react-redux"
import DetailsCover from "../../common/components/DetailsCover"
import ListOfTracks from "../../common/components/ListOfTracks"
import LoadingView from "../../common/components/LoadingView"
import PlaylistHeaderControl from "../../common/components/PlaylistHeaderControl"
import PlaylistTitle from "../../common/components/PlaylistTitle"
import ShuffleButton from "../../common/components/ShuffleButton"
import UIHelper from "../../common/helpers/UIHelper"
import usePlaylistAnim from "../../common/hooks/usePlaylistAnim"
import { colors } from "../../common/theme"
import { RootStoreType } from "../../redux/rootReducer"
import { clearCurrentPlaylist } from "../../redux/slices"

const initialState = {
  dominantColor: colors.background,
  isLoading: true,
}

const PlaylistDetails = ({
  playlistDetails,
  clearCurrentPlaylist,
  navigation,
  username,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current
  const { heightAnim, opacityAnim, translateAnim } = usePlaylistAnim(offsetY)
  const [{ isLoading, dominantColor }, setState] = useState(initialState)
  const [scrollViewHeight, setScrollViewHeight] = useState<number>(100)

  const goBack = useCallback(() => {
    clearCurrentPlaylist()
    navigation.goBack()
    return true
  }, [clearCurrentPlaylist, navigation])

  const setDefaultColors = () => {
    setState({
      dominantColor: colors.tabBar,
      isLoading: false,
    })
  }

  useLayoutEffect(() => {
    const didFocusSub = navigation.addListener("didFocus", async () => {
      BackHandler.addEventListener("hardwareBackPress", goBack)

      if (playlistDetails?.imageUrl) {
        try {
          const colors = await ImageColors.getColors(
            playlistDetails?.imageUrl,
            { average: true },
          )
          if (colors.platform === "android") {
            setState({
              dominantColor: colors.average,
              isLoading: false,
            })
          } else {
            setState({
              dominantColor: colors.background,
              isLoading: false,
            })
          }
        } catch (e) {
          console.warn(e)
          setDefaultColors()
        }
      } else {
        setDefaultColors()
      }
    })

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", goBack)
      didFocusSub.remove()
    }
  }, [goBack, navigation, playlistDetails])

  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <NavigationEvents
        onWillFocus={() => StatusBar.setBarStyle("light-content")}
      />
      <PlaylistHeaderControl
        goBack={goBack}
        isLoading={isLoading}
        id={playlistDetails?.id}
        itemType={playlistDetails?.type}
      />
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
              colors={[dominantColor, colors.background]}
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
              username={username}
            />
          </View>
          <ShuffleButton offsetY={offsetY} />
          <Animated.ScrollView
            onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
            bounces={false}
            decelerationRate={0.994}
            overScrollMode="never"
            onScroll={UIHelper.onScroll({ y: offsetY })}
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
  )
}

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
    marginTop: 360,
    zIndex: 5,
  },
})

const mapStateToProps = (state: RootStoreType) => ({
  playlistDetails: state.playlistReducer.playlistDetails,
  username: state.userReducer.profile?.display_name,
})

const mapDispatchToProps = {
  clearCurrentPlaylist,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(PlaylistDetails)
