import React, { useEffect, useState, useRef, useCallback } from "react"
import { StyleSheet, Text, View, LayoutChangeEvent } from "react-native"
import Animated, {
  Clock,
  concat,
  cond,
  Easing,
  eq,
  greaterThan,
  set,
  useCode,
  Value,
  and,
} from "react-native-reanimated"
import { bin, timing } from "react-native-redash"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useDispatch } from "react-redux"
import { colors, dimensions } from "../../common/theme"
import { redoLogin } from "../../redux/slices"
import ApiService from "../../services/network/SpotifyApiService"
import SpotifyAsyncStoreService from "../../services/asyncstorage/SpotifyAsyncStoreService"

const PLAYER_HEIGHT = 44
const POLLING_PERIOD_SECONDS = 10

const OFFSET = 150

interface Props {
  barHeight: number
}

const animatedProgress = new Value(0)
const clock = new Clock()

const translateX = new Value(0)
const clockText = new Clock()

const StickyPlayer = ({ barHeight }: Props) => {
  const dispatch = useDispatch()
  const [trackTitleWidth, setTrackTitleWidth] = useState(0)
  const { getTrackData, trackState } = useCurrentPlayingTrack()
  const {
    title,
    artist,
    currentProgressPct,
    intervalAmountPct,
    isPlaying,
  } = trackState

  const timingTo = currentProgressPct + intervalAmountPct

  useCode(
    () => [
      cond(
        eq(1, bin(isPlaying)),
        cond(
          greaterThan(new Value(currentProgressPct), 0),
          set(
            animatedProgress,
            timing({
              duration: POLLING_PERIOD_SECONDS * 1000,
              from: currentProgressPct,
              to: timingTo >= 100 ? 100 : timingTo,
              easing: Easing.linear,
              clock,
            }),
          ),
        ),
        set(animatedProgress, currentProgressPct),
      ),
    ],
    [currentProgressPct, isPlaying],
  )

  const progressValue = concat(animatedProgress, "%")

  const handlePlay = useCallback(async () => {
    try {
      await ApiService.resumePlayback()
      await getTrackData()
    } catch (e) {
      if (ApiService.sessionIsExpired(e)) {
        dispatch(redoLogin())
      } else {
        console.warn(e)
      }
    }
  }, [dispatch, getTrackData])

  const handlePause = useCallback(async () => {
    try {
      await ApiService.pausePlayback()
      await getTrackData()
    } catch (e) {
      if (ApiService.sessionIsExpired(e)) {
        dispatch(redoLogin())
      } else {
        console.warn(e)
      }
    }
  }, [dispatch, getTrackData])

  const nextTrack = useCallback(async () => {
    try {
      await ApiService.nextTrack()
      setTimeout(async () => {
        await getTrackData()
      }, 50)
    } catch (e) {
      if (ApiService.sessionIsExpired(e)) {
        dispatch(redoLogin())
      } else {
        console.warn(e)
      }
    }
  }, [dispatch, getTrackData])

  const shouldAnimateTrackTitle = (`${title} • ` + artist).length > 40

  useCode(
    () =>
      cond(
        and(
          greaterThan(trackTitleWidth, 0),
          eq(1, bin(shouldAnimateTrackTitle)),
        ),
        set(
          translateX,
          timing({
            duration: 15 * 1000,
            from: 0,
            to: -trackTitleWidth - OFFSET,
            easing: Easing.linear,
            clock: clockText,
          }),
        ),
      ),
    [shouldAnimateTrackTitle, trackTitleWidth],
  )

  const captureWidth = useCallback(
    (e: LayoutChangeEvent) => setTrackTitleWidth(e.nativeEvent.layout.width),
    [],
  )

  if (title.length === 0) return null
  return (
    <View
      style={[
        styles.bar,
        {
          bottom: barHeight,
        },
      ]}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressValue,
          },
        ]}
      />
      <View style={styles.progressBarBackground} />
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
      <Animated.Text
        onLayout={captureWidth}
        style={[
          styles.title,
          {
            transform: [{ translateX }],
          },
        ]}>
        {`${title} • `}
        <Text style={styles.artist}>{artist}</Text>
      </Animated.Text>
      {shouldAnimateTrackTitle && (
        <Animated.Text
          style={[
            styles.title,
            {
              left: OFFSET,
              transform: [{ translateX }],
            },
          ]}>
          {`${title} • `}
          <Text style={styles.artist}>{artist}</Text>
        </Animated.Text>
      )}
      <View style={styles.controlsContainer}>
        <View style={styles.iconContainer}>
          <Icon
            onPress={isPlaying ? handlePause : handlePlay}
            name={isPlaying ? "pause" : "play"}
            size={28}
            style={styles.playIcon}
          />
        </View>
        <View style={styles.iconContainer}>
          <Icon
            onPress={nextTrack}
            name="skip-next"
            size={28}
            style={styles.playIcon}
          />
        </View>
      </View>
    </View>
  )
}

const initialTrackState = {
  currentProgressPct: 0,
  intervalAmountPct: 0,
  title: "",
  artist: "",
  isPlaying: false,
}

const useCurrentPlayingTrack = () => {
  const [trackState, setTrackState] = useState(initialTrackState)
  const isFirstRender = useRef(true)

  const dispatch = useDispatch()

  useEffect(() => {
    const getLastPlayedTrack = async () => {
      const trackData = await SpotifyAsyncStoreService.getTrackData()

      if (trackData) {
        setTrackState(JSON.parse(trackData))
      }
    }

    getLastPlayedTrack()
  }, [])

  const getTrackData = useCallback(async () => {
    try {
      const trackData = await ApiService.getPlayingTrack()

      if (typeof trackData === "object" && "item" in trackData) {
        const currentProgressPct =
          (trackData.progress_ms / trackData.item.duration_ms) * 100

        const intervalAmountPct =
          ((POLLING_PERIOD_SECONDS * 1000) / trackData.item.duration_ms) * 100

        if (trackState.currentProgressPct != currentProgressPct) {
          // if track is not paused
          const newState = {
            currentProgressPct,
            intervalAmountPct,
            title: trackData.item.name,
            artist: trackData.item.artists[0].name,
            isPlaying: trackData.is_playing,
          }

          setTrackState(newState)

          await SpotifyAsyncStoreService.putTrackData(
            JSON.stringify({ ...newState, isPlaying: false }),
          )
        }
      } else {
        // paused
        setTrackState(state => ({
          ...state,
          isPlaying: false,
        }))
      }
    } catch (e) {
      if (ApiService.sessionIsExpired(e)) {
        dispatch(redoLogin())
      } else {
        console.warn(e)
      }
    }
  }, [trackState.currentProgressPct, dispatch])

  useEffect(() => {
    if (isFirstRender.current) {
      getTrackData()
      isFirstRender.current = false
    }

    const fetchInterval = setInterval(
      getTrackData,
      POLLING_PERIOD_SECONDS * 1000,
    )

    return () => {
      clearInterval(fetchInterval)
    }
  }, [getTrackData, trackState.currentProgressPct, trackState.title, dispatch])

  return { trackState, getTrackData }
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
    backgroundColor: colors.tabBar,
    zIndex: -1,
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
    zIndex: -2,
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
    flexDirection: "row",
    position: "absolute",
    right: 0,
    zIndex: -1,
  },
  progressBar: {
    position: "absolute",
    top: -2,
    backgroundColor: colors.white,
    height: 2,
    zIndex: 2,
  },
  progressBarBackground: {
    position: "absolute",
    top: -2,
    backgroundColor: "#3E3E3E",
    width: "100%",
    height: 3,
  },
})

export default StickyPlayer
