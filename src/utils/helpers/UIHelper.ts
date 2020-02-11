import Animated, { Easing } from "react-native-reanimated";
import {
  Platform,
  Animated as AnimatedRN,
  Easing as EasingRN,
} from "react-native";
import { height, width } from "../constants/_theme";

const btnScaleAnim = {
  in: { toValue: 0.98, duration: 50, easing: Easing.inOut(Easing.ease) },
  out: {
    toValue: 1,
    duration: 50,
    easing: Easing.inOut(Easing.ease),
  },
};

// Forked from: react-native-iphone-x-helper
// https://github.com/ptelad/react-native-iphone-x-helper
// TODO: better approach?
const isIphoneX = () => {
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || height === 896 || width === 896)
  );
};

const onScroll = (contentOffset: {
  x?: Animated.Node<number>;
  y?: Animated.Node<number>;
}) =>
  Animated.event([
    {
      nativeEvent: {
        contentOffset,
      },
    },
  ]);

// Forked from react-navigation-transitions
// https://github.com/plmok61/react-navigation-transitions
const fadeIn = (duration = 300) => {
  return {
    transitionSpec: {
      duration,
      easing: EasingRN.out(EasingRN.poly(4)),
      timing: AnimatedRN.timing,
      useNativeDriver: true,
    },
    screenInterpolator: ({ position, scene }: any) => {
      const { index } = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1],
      });

      return { opacity };
    },
  };
};

const {
  Value,
  timing,
  clockRunning,
  startClock,
  block,
  cond,
  set,
  stopClock,
} = Animated;

const opacityTiming = (
  clock: Animated.Clock,
  start: number,
  end: number,
  duration: number,
) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration,
    toValue: new Value(0),
    easing: Easing.out(Easing.exp),
  };

  return block([
    cond(
      clockRunning(clock),
      [],
      [set(state.position, start), set(config.toValue, end), startClock(clock)],
    ),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};

const UIHelper = {
  btnScaleAnim,
  isIphoneX,
  onScroll,
  fadeIn,
  opacityTiming,
};

export default UIHelper;
