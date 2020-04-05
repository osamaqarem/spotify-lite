import React, { useEffect, useState, useCallback } from "react"
import { SafeAreaView, StyleSheet, ToastAndroid, View } from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../theme"
import DotsView from "./DotsView"
import BackBtn from "./BackBtn"
import Animated, { Value } from "react-native-reanimated"
import UIHelper from "../helpers/UIHelper"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import { useDispatch } from "react-redux"
import { redoLogin } from "../../redux/slices"
import SpotifyHttpException from "../../services/network/exceptions/SpotifyHttpException"
import SpotifyEndpoints from "../../services/network/SpotifyEndpoints"

export const HEADER_HEIGHT = 42

const heartScale = new Value(1)

interface Props {
  goBack: () => void
  isLoading: boolean
  id: string | undefined | null
}

// TODO:
// Like/Save for artists, playlists, tracks, albums is all different.

const PlaylistHeaderControl = ({ goBack, isLoading, id }: Props) => {
  const dispatch = useDispatch()
  const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      try {
        if (id) {
          const [isSaved] = await SpotifyApiService.checkSavedAlbums(id)

          setIsSaved(isSaved)
        }
      } catch (e) {
        if (SpotifyApiService.sessionIsExpired(e)) {
          dispatch(redoLogin())
        } else {
          console.warn(e)
        }
      }
    })()
  }, [id, dispatch])

  const handleSave = useCallback(async () => {
    console.tron(id)
    if (id && !isSaved) {
      try {
        const res = await SpotifyApiService.saveAlbums(id)
        if (res.ok) {
          setIsSaved(true)
        } else {
          throw new SpotifyHttpException(
            "not ok",
            "failed to save track",
            SpotifyEndpoints.saveAlbums(id),
          )
        }
      } catch (e) {
        if (SpotifyApiService.sessionIsExpired(e)) {
          dispatch(redoLogin())
        } else {
          console.warn(e)
        }
      }
    }
  }, [dispatch, id, isSaved])

  const handleRemove = useCallback(async () => {
    if (id && isSaved) {
      try {
        const res = await SpotifyApiService.removeAlbums(id)
        if (res.ok) {
          setIsSaved(false)
        } else {
          throw new SpotifyHttpException(
            "not ok",
            "failed to remove track",
            SpotifyEndpoints.removeAlbums(id),
          )
        }
      } catch (e) {
        if (SpotifyApiService.sessionIsExpired(e)) {
          dispatch(redoLogin())
        } else {
          console.warn(e)
        }
      }
    }
  }, [dispatch, id, isSaved])

  return (
    <SafeAreaView style={styles.container}>
      <BackBtn goBack={goBack} />
      {!isLoading && (
        <>
          <Animated.View
            style={[
              styles.heartContainer,
              { transform: [{ scale: heartScale }] },
            ]}>
            <TouchableWithoutFeedback
              onPress={isSaved ? handleRemove : handleSave}
              onPressIn={() =>
                Animated.timing(heartScale, UIHelper.heartScaleAnim.in).start()
              }
              onPressOut={() =>
                Animated.timing(heartScale, UIHelper.heartScaleAnim.out).start()
              }>
              <Icon
                name={
                  id === null ? "heart" : isSaved ? "heart" : "heart-outline"
                }
                size={26}
                style={{
                  color:
                    id === null
                      ? colors.green
                      : isSaved
                      ? colors.green
                      : colors.white,
                }}
              />
            </TouchableWithoutFeedback>
          </Animated.View>
          <View style={styles.dotsContainer}>
            <TouchableWithoutFeedback
              onPress={() => {
                ToastAndroid.show("Dots!", ToastAndroid.SHORT)
              }}>
              <DotsView color={colors.white} />
            </TouchableWithoutFeedback>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    top: 0,
    height: HEADER_HEIGHT,
  },
  heartContainer: {
    position: "absolute",
    right: 50,
    top: 6,
    height: HEADER_HEIGHT,
    width: HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  dotsContainer: {
    position: "absolute",
    right: 9,
    top: 6,
    height: HEADER_HEIGHT,
    width: HEADER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default PlaylistHeaderControl
