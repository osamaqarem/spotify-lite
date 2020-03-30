import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, {
  call,
  Clock,
  concat,
  cond,
  Easing,
  eq,
  greaterThan,
  set,
  useCode,
  Value,
} from "react-native-reanimated"
import { bin, timing } from "react-native-redash"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { colors } from "../../common/theme"
import ApiService from "../../services/network/ApiService"

const PLAYER_HEIGHT = 44
const INTERVAL_LENGTH_SECONDS = 10

interface Props {
  barHeight: number
  // title: string
  // showing: boolean
  // playerState: 'PAUSED' | 'RESUMED' | 'LOADING'
}

const animatedProgress = new Value(0)
const clock = new Clock()

const StickyPlayer = ({ barHeight }: Props) => {
  const showing = true
  const playerState = "PAUSED"

  const {
    title,
    artist,
    currentProgress,
    intervalAmountPct,
    isPlaying,
  } = useCurrentPlayingTrack()

  const timingTo = currentProgress + intervalAmountPct

  useCode(
    () => [
      cond(
        eq(1, bin(isPlaying)),
        cond(
          greaterThan(new Value(currentProgress), 0),
          set(
            animatedProgress,
            timing({
              duration: INTERVAL_LENGTH_SECONDS * 1000,
              from: currentProgress,
              to: timingTo >= 100 ? 100 : timingTo,
              easing: Easing.linear,
              clock,
            }),
          ),
        ),
      ),
    ],
    [currentProgress],
  )

  const progressValue = concat(animatedProgress, "%")

  useCode(
    () =>
      call([progressValue], ([p]) => {
        console.tron(p)
      }),
    [progressValue],
  )

  if (!showing) return null
  return (
    <View
      style={[
        styles.bar,
        {
          bottom: barHeight,
        },
      ]}>
      <Animated.View
        style={{
          position: "absolute",
          top: -2,
          backgroundColor: colors.white,
          width: progressValue,
          height: 2,
          zIndex: 2,
        }}
      />
      <View
        style={{
          position: "absolute",
          top: -2,
          backgroundColor: "#3E3E3E",
          width: "100%",
          height: 3,
        }}
      />
      <View style={styles.iconContainer}>
        <Icon
          onPress={() => {
            return
          }}
          name={true ? "heart" : "heart-outline"}
          size={24}
          style={styles.heartIcon}
        />
      </View>
      <Text style={styles.title}>
        {`${title} • `}
        <Text style={styles.artist}>{artist}</Text>
      </Text>
      <View style={styles.controlsContainer}>
        <View style={styles.iconContainer}>
          <Icon
            onPress={() => {
              console.tron("pressable")
            }}
            name="play"
            size={28}
            style={styles.playIcon}
          />
        </View>
        <View style={styles.iconContainer}>
          <Icon
            onPress={() => {
              return
            }}
            name="play-pause"
            size={28}
            style={styles.playIcon}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.tabBar,
    height: PLAYER_HEIGHT,
    width: "100%",
    position: "absolute",
    zIndex: 1,
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  heartIcon: {
    color: colors.green,
    right: 2,
    bottom: 1,
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 2,
    letterSpacing: 0.4,
  },
  artist: {
    fontWeight: "normal",
    fontSize: 11,
    color: colors.lightGrey,
  },
  playIcon: {
    color: colors.white,
    top: -2,
    right: -4,
  },
  controlsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
})

const useCurrentPlayingTrack = () => {
  const [trackState, setTrackState] = useState({
    currentProgress: 0,
    intervalAmountPct: 0,
    title: "",
    artist: "",
    isPlaying: false,
  })

  useEffect(() => {
    const fetchInterval = setInterval(async () => {
      try {
        const trackData = await ApiService.getPlayingTrack()

        const currentProgress =
          (trackData.progress_ms / trackData.item.duration_ms) * 100

        const intervalAmountPct =
          ((INTERVAL_LENGTH_SECONDS * 1000) / trackData.item.duration_ms) * 100

        // no useless rerenders
        if (trackState.currentProgress != currentProgress) {
          setTrackState({
            currentProgress,
            intervalAmountPct,
            title: trackData.item.name,
            artist: trackData.item.artists[0].name,
            isPlaying: trackData.is_playing,
          })
        }
      } catch (e) {}
    }, INTERVAL_LENGTH_SECONDS * 1000)

    return () => {
      clearInterval(fetchInterval)
    }
  }, [])

  return trackState
}

export default StickyPlayer
