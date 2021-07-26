import React from "react";
import {
  GestureResponderEvent,
  PanResponderGestureState,
  Animated,
  ViewProps
} from "react-native";

export type SwipeablePanResponderCallback = (
  e: GestureResponderEvent,
  gestureState: PanResponderGestureState,
  instance: ThisType<Swipeable>
) => void;

export type SwipeableAnimationFn = () =>
  | ReturnType<Animated.timing>
  | ReturnType<Animated.spring>;

export type SwipeableAnimationConfig =
  | Animated.TimingAnimationConfig
  | Animated.SpringAnimationConfig;

export type SwipeableProps = {
  // elements
  children: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  leftButtons?: React.ReactNode[];
  rightButtons?: React.ReactNode[];

  // left action lifecycle
  onLeftActionActivate?: SwipeablePanResponderCallback;
  onLeftActionDeactivate?: SwipeablePanResponderCallback;
  onLeftActionRelease?: SwipeablePanResponderCallback;
  onLeftActionComplete?: SwipeablePanResponderCallback;
  leftActionActivationDistance?: number;
  leftActionReleaseAnimationFn?: SwipeableAnimationFn;
  leftActionReleaseAnimationConfig?: SwipeableAnimationConfig;

  // right action lifecycle
  onRightActionActivate?: SwipeablePanResponderCallback;
  onRightActionDeactivate?: SwipeablePanResponderCallback;
  onRightActionRelease?: SwipeablePanResponderCallback;
  onRightActionComplete?: SwipeablePanResponderCallback;
  rightActionActivationDistance?: number;
  rightActionReleaseAnimationFn?: SwipeableAnimationFn;
  rightActionReleaseAnimationConfig?: SwipeableAnimationConfig;

  // left buttons lifecycle
  onLeftButtonsActivate?: SwipeablePanResponderCallback;
  onLeftButtonsDeactivate?: SwipeablePanResponderCallback;
  onLeftButtonsOpenRelease?: SwipeablePanResponderCallback;
  onLeftButtonsOpenComplete?: SwipeablePanResponderCallback;
  onLeftButtonsCloseRelease?: SwipeablePanResponderCallback;
  onLeftButtonsCloseComplete?: SwipeablePanResponderCallback;
  leftButtonWidth?: number;
  leftButtonsActivationDistance?: number;
  leftButtonsOpenReleaseAnimationFn?: SwipeableAnimationFn;
  leftButtonsOpenReleaseAnimationConfig?: SwipeableAnimationConfig;
  leftButtonsCloseReleaseAnimationFn?: SwipeableAnimationFn;
  leftButtonsCloseReleaseAnimationConfig?: SwipeableAnimationConfig;

  // right buttons lifecycle
  onRightButtonsActivate?: SwipeablePanResponderCallback;
  onRightButtonsDeactivate?: SwipeablePanResponderCallback;
  onRightButtonsOpenRelease?: SwipeablePanResponderCallback;
  onRightButtonsOpenComplete?: SwipeablePanResponderCallback;
  onRightButtonsCloseRelease?: SwipeablePanResponderCallback;
  onRightButtonsCloseComplete?: SwipeablePanResponderCallback;
  rightButtonWidth?: number;
  rightButtonsActivationDistance?: number;
  rightButtonsOpenReleaseAnimationFn?: SwipeableAnimationFn;
  rightButtonsOpenReleaseAnimationConfig?: SwipeableAnimationConfig;
  rightButtonsCloseReleaseAnimationFn?: SwipeableAnimationFn;
  rightButtonsCloseReleaseAnimationConfig?: SwipeableAnimationConfig;

  // base swipe lifecycle
  onSwipeStart?: SwipeablePanResponderCallback;
  onSwipeMove?: SwipeablePanResponderCallback;
  onSwipeRelease?: SwipeablePanResponderCallback;
  onSwipeComplete?: SwipeablePanResponderCallback;
  swipeReleaseAnimationFn?: SwipeableAnimationFn;
  swipeReleaseAnimationConfig?: SwipeableAnimationConfig;

  // misc
  onRef?: (ref: React.RefObject<Swipeable>) => void;
  onPanAnimatedValueRef?: (value: Animated.AnimatedValueXY) => void;
  swipeStartMinDistance?: number;
  testID?: string;

  // styles
  style?: ViewProps["style"];
  leftContainerStyle?: ViewProps["style"];
  leftButtonContainerStyle?: ViewProps["style"];
  rightContainerStyle?: ViewProps["style"];
  rightButtonContainerStyle?: ViewProps["style"];
  contentContainerStyle?: ViewProps["style"];
};

declare class Swipeable extends React.PureComponent<SwipeableProps> {}

export default Swipeable;
