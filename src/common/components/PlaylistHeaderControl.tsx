import React, { useEffect, useState } from "react"
import { SafeAreaView, StyleSheet, ToastAndroid, View } from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import Animated, { Value } from "react-native-reanimated"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import UIHelper from "../helpers/UIHelper"
import { ItemType, SpotifyLibraryManager } from "../hooks/useLibraryManager"
import { colors } from "../theme"
import BackBtn from "./BackBtn"
import DotsView from "./DotsView"
import { useSelector } from "react-redux"
import { RootStoreType } from "../../redux/rootReducer"

export const HEADER_HEIGHT = 42

const heartScale = new Value(1)

interface Props {
  goBack: () => void
  isLoading: boolean
  id: string | undefined | null
  itemType: ItemType | undefined
}

const PlaylistHeaderControl = ({ goBack, isLoading, id, itemType }: Props) => {
  const {
    getItemSavedOrFollowedState,
    saveItem,
    removeItem,
  } = SpotifyLibraryManager()
  const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined)
  const userId = useSelector(
    (state: RootStoreType) => state.userReducer.profile?.id,
  )

  useEffect(() => {
    ;(async () => {
      if (typeof isSaved === "undefined" && id && userId && itemType) {
        let result
        if (itemType === "PLAYLIST") {
          result = await getItemSavedOrFollowedState(id, itemType, userId)
        } else {
          result = await getItemSavedOrFollowedState(id, itemType)
        }
        setIsSaved(Boolean(result))
      }
    })()
  }, [getItemSavedOrFollowedState, id, itemType, isSaved, userId])

  const handleSave = async () => {
    if (id && !isSaved && itemType) {
      const success = await saveItem(id, itemType)
      success && setIsSaved(true)
    }
  }

  const handleRemove = async () => {
    if (id && isSaved && itemType) {
      const success = await removeItem(id, itemType)
      success && setIsSaved(false)
    }
  }

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
