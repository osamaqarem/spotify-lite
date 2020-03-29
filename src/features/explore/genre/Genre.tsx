import React, { useLayoutEffect, useRef, useState } from "react"
import { StatusBar, StyleSheet, Text, View } from "react-native"
import ImageColors from "react-native-image-colors"
import LinearGradient from "react-native-linear-gradient"
import Animated from "react-native-reanimated"
import { NavigationEvents, SafeAreaView } from "react-navigation"
import { NavigationStackProp } from "react-navigation-stack"
import { connect, ConnectedProps } from "react-redux"
import BackBtn from "../../../common/components/BackBtn"
import LoadingView from "../../../common/components/LoadingView"
import { colors } from "../../../common/theme"
import { RootStoreType } from "../../../redux/rootReducer"
import { PlaylistDetailsType } from "../../../redux/slices"
import { getCategoryById } from "../../../redux/slices/browseSlice"
import { getPlaylistByIdSuccess } from "../../../redux/slices/playlistSlice"
import { Routes } from "../../navigation/_routes"
import ListOfGenrePlaylists from "./components/ListOfGenrePlaylists"
import { HEADER_HEIGHT } from "../../../common/components/PlaylistHeaderControl"

const AnimatedLinearGradient: typeof LinearGradient = Animated.createAnimatedComponent(
  LinearGradient,
)

const initialState = {
  dominantColor: colors.tabBar,
  isLoading: true,
}

const Genre = ({
  navigation,
  genreDetails,
  getPlaylistByIdSuccess,
  getCategoryById,
  isLoadingData,
}: ReduxProps & { navigation: NavigationStackProp }) => {
  const offsetY = useRef(new Animated.Value(0)).current

  const heightAnim = useRef(
    offsetY.interpolate({
      inputRange: [0, 150],
      outputRange: [40, 0],
      extrapolate: Animated.Extrapolate.CLAMP,
    }),
  ).current

  const { genrePlaylists, title, id } = genreDetails
  const [seeMoreVisible, setSeeMoreVisible] = useState(true)
  const [{ isLoading, dominantColor }, setState] = useState(initialState)

  useLayoutEffect(() => {
    const fetchColors = async () => {
      if (genrePlaylists[0]?.imageUrl) {
        try {
          const colors = await ImageColors.getColors(
            genrePlaylists[0]?.imageUrl,
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
    }

    fetchColors()
  }, [genrePlaylists, isLoading])

  const setDefaultColors = () => {
    setState({
      dominantColor: colors.tabBar,
      isLoading: false,
    })
  }

  const handleSeeMore = () => {
    setSeeMoreVisible(false)
    getCategoryById({
      title: title!,
      id: id!,
      getRestOfItems: true,
    })
  }

  const onPlaylistPressed = (playlist: PlaylistDetailsType) => {
    getPlaylistByIdSuccess(playlist)
    navigation.navigate(Routes.BottomTabs.ExploreStack.PlaylistDetails)
  }

  const handleWillFocus = () => {
    StatusBar.setBarStyle("light-content")
  }

  const handleBack = () => {
    navigation.goBack()
  }

  const notReady = isLoadingData || isLoading

  return (
    <SafeAreaView style={styles.container}>
      {!notReady && (
        <AnimatedLinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
          colors={[dominantColor, colors.background]}
          // @ts-ignore
          style={[
            {
              height: Animated.concat(heightAnim, "%") as any,
            },
            styles.gradient,
          ]}
        />
      )}
      <View style={[styles.container, { backgroundColor: "transparent" }]}>
        <NavigationEvents onWillFocus={handleWillFocus} />
        {(notReady && <LoadingView viewStyle={styles.loading} />) || (
          <>
            <BackBtn goBack={handleBack} />
            <Text style={styles.title}>{title}</Text>
            <ListOfGenrePlaylists
              genrePlaylists={genrePlaylists}
              handleSeeMore={handleSeeMore}
              offsetY={offsetY}
              onPlaylistPressed={onPlaylistPressed}
              seeMoreVisible={seeMoreVisible}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  gradient: { width: "100%", opacity: 1, ...StyleSheet.absoluteFillObject },
  title: {
    position: "absolute",
    top: "25%",
    color: colors.white,
    fontSize: 40,
    fontWeight: "bold",
  },
  loading: { marginTop: 50 },
})

const mapStateToProps = (state: RootStoreType) => ({
  genreDetails: state.browseReducer.genreDetails,
  isLoadingData: state.browseReducer.isLoading,
})

const mapDispatchToProps = {
  getPlaylistByIdSuccess,
  getCategoryById,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>

export default connector(Genre)
