import React, { useCallback, useEffect, useRef, useState } from "react"
import { LayoutChangeEvent, StyleSheet, View } from "react-native"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import Animated, {
  and,
  Clock,
  clockRunning,
  concat,
  cond,
  Easing,
  eq,
  greaterThan,
  lessOrEq,
  multiply,
  not,
  set,
  startClock,
  stopClock,
  useCode,
  Value,
} from "react-native-reanimated"
import { bin, delay, loop, timing } from "react-native-redash"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useDispatch } from "react-redux"
import { Subject, zip } from "rxjs"
import UIHelper from "../../common/helpers/UIHelper"
import { colors } from "../../common/theme"
import { redoLogin } from "../../redux/slices"
import SpotifyAsyncStoreService from "../../services/asyncstorage/SpotifyAsyncStoreService"
import SpotifyHttpException from "../../services/network/exceptions/SpotifyHttpException"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import SpotifyEndpoints from "../../services/network/SpotifyEndpoints"

export const PLAYER_HEIGHT = 50
const POLLING_PERIOD_SECONDS = 10

const OFFSET = 150

interface Props {
  barHeight: number
}

const animatedProgress = new Value(0)
const progressClock = new Clock()

const trackTitleclock = new Clock()
const mayStartAnimation = new Value(0)
const translateX = new Value(0)

const heartScale = new Animated.Value(1)

const trackTitleWidth$ = new Subject<number>()
const artistWidth$ = new Subject<number>()
const totalWidth$ = zip(trackTitleWidth$, artistWidth$)

const StickyPlayer = ({ barHeight }: Props) => {
  const dispatch = useDispatch()
  const [shown, setShown] = useState(false)
  const [trackWidth, setTrackWidth] = useState(0)
  const { getTrackData, trackState } = useCurrentPlayingTrack()
  const {
    title,
    artist,
    currentProgressPct,
    intervalAmountPct,
    isPlaying,
    isSaved,
    id,
  } = trackState

  useEffect(() => {
    const sub = totalWidth$.subscribe(handleWidth)
    return () => {
      sub.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShown(true)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

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
              clock: progressClock,
            }),
          ),
        ),
        set(animatedProgress, currentProgressPct),
      ),
    ],
    [currentProgressPct, isPlaying],
  )

  const progressValue = concat(animatedProgress, "%")

  const titleIsTooLong = (`${title} • ` + artist).length > 44
  const validTrackWidth = trackWidth > 0

  useCode(
    () => [
      cond(
        and(eq(1, bin(validTrackWidth)), eq(1, bin(titleIsTooLong))),
        [
          set(mayStartAnimation, 1),
          cond(not(clockRunning(trackTitleclock)), startClock(trackTitleclock)),
          set(
            translateX,
            multiply(
              -trackWidth - OFFSET,
              loop({
                duration: 15 * 1000,
                easing: Easing.linear,
                clock: trackTitleclock,
                autoStart: false,
              }),
            ),
          ),
        ],
        set(translateX, 0),
      ),
    ],
    [titleIsTooLong, validTrackWidth, trackWidth],
  )

  useCode(
    () => [
      cond(
        and(
          // TODO: this is not working well on iOS
          eq(1, mayStartAnimation),
          lessOrEq(translateX, -trackWidth - OFFSET + 0.5),
        ),
        [stopClock(trackTitleclock), delay(startClock(trackTitleclock), 1000)],
      ),
    ],
    [translateX, trackWidth, mayStartAnimation],
  )

  const handlePlay = useCallback(async () => {
    try {
      await SpotifyApiService.resumePlayback()
      await getTrackData()
    } catch (e) {
      if (SpotifyApiService.sessionIsExpired(e)) {
        dispatch(redoLogin())
      } else {
        console.warn(e)
      }
    }
  }, [dispatch, getTrackData])

  const handlePause = useCallback(async () => {
    try {
      await SpotifyApiService.pausePlayback()
      await getTrackData()
    } catch (e) {
      if (SpotifyApiService.sessionIsExpired(e)) {
        dispatch(redoLogin())
      } else {
        console.warn(e)
      }
    }
  }, [dispatch, getTrackData])

  const nextTrack = useCallback(async () => {
    try {
      await SpotifyApiService.nextTrack()
      setTimeout(async () => {
        await getTrackData()
      }, 50)
    } catch (e) {
      if (SpotifyApiService.sessionIsExpired(e)) {
        dispatch(redoLogin())
      } else {
        console.warn(e)
      }
    }
  }, [dispatch, getTrackData])

  const handleSave = useCallback(async () => {
    if (!isSaved) {
      try {
        const res = await SpotifyApiService.saveTracks(id)
        if (res.ok) {
          await getTrackData()
        } else {
          throw new SpotifyHttpException(
            "not ok",
            "failed to save track",
            SpotifyEndpoints.saveTracks(id),
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
  }, [dispatch, getTrackData, id, isSaved])

  const handleRemove = useCallback(async () => {
    if (isSaved) {
      try {
        const res = await SpotifyApiService.removeTracks(id)
        if (res.ok) {
          await getTrackData()
        } else {
          throw new SpotifyHttpException(
            "not ok",
            "failed to remove track",
            SpotifyEndpoints.removeTracks(id),
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
  }, [dispatch, getTrackData, id, isSaved])

  const captureTitleWidth = useCallback((e: LayoutChangeEvent) => {
    trackTitleWidth$.next(e.nativeEvent.layout.width)
  }, [])

  const captureTotalWidth = useCallback((e: LayoutChangeEvent) => {
    artistWidth$.next(e.nativeEvent.layout.width)
  }, [])

  const handleWidth = ([trackTitleWidth, artistWidth]: [number, number]) => {
    setTrackWidth(trackTitleWidth + artistWidth)
  }

  if (title.length === 0) return null
  return (
    <View
      style={[
        styles.bar,
        {
          bottom: barHeight,
          opacity: shown ? 1 : 0,
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
      <Animated.View
        style={[styles.iconContainer, { transform: [{ scale: heartScale }] }]}>
        <TouchableWithoutFeedback
          onPress={isSaved ? handleRemove : handleSave}
          onPressIn={() =>
            Animated.timing(heartScale, UIHelper.heartScaleAnim.in).start()
          }
          onPressOut={() =>
            Animated.timing(heartScale, UIHelper.heartScaleAnim.out).start()
          }>
          <Icon
            name={isSaved ? "heart" : "heart-outline"}
            size={24}
            style={[
              styles.heartIcon,
              {
                color: isSaved ? colors.green : colors.white,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
      <Animated.Text
        onLayout={captureTitleWidth}
        style={[
          styles.title,
          {
            transform: [{ translateX }],
          },
        ]}>
        {`${title} • `}
      </Animated.Text>
      <Animated.Text
        onLayout={captureTotalWidth}
        style={[
          styles.artist,
          {
            transform: [{ translateX }],
          },
        ]}>
        {artist}
      </Animated.Text>
      {titleIsTooLong && (
        <>
          <Animated.Text
            style={[
              styles.title,
              {
                left: OFFSET,
                transform: [{ translateX }],
              },
            ]}>
            {`${title} • `}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.artist,
              {
                transform: [{ translateX }],
              },
            ]}>
            {artist}
          </Animated.Text>
        </>
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
  isSaved: false,
  id: "",
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
      const trackData = await SpotifyApiService.getPlayingTrack()

      if (
        typeof trackData === "object" &&
        "item" in trackData &&
        trackData.item
      ) {
        const [isSaved] = await SpotifyApiService.getSavedStateForTracks(
          trackData.item.id,
        )

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
            isSaved: isSaved,
            id: trackData.item.id,
          }

          setTrackState(newState)

          await SpotifyAsyncStoreService.putTrackData(
            JSON.stringify({ ...newState, isPlaying: false }),
          )
        }
      } else {
        // paused
        setTrackState((state) => ({
          ...state,
          isPlaying: false,
        }))
      }
    } catch (e) {
      if (SpotifyApiService.sessionIsExpired(e)) {
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
    borderBottomColor: colors.tabBar,
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
    zIndex: -2,
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
