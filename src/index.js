/* eslint-disable import/no-unresolved, import/extensions */
import React, {PureComponent} from 'react';
import {Animated, Dimensions, Easing, PanResponder, StyleSheet, View, ViewPropTypes} from 'react-native';
import {PropTypes} from 'prop-types';
/* eslint-enable import/no-unresolved, import/extensions */

function noop() {}

export default class Swipeable extends PureComponent {

  static propTypes = {
    // elements
    children: PropTypes.any,
    leftContent: PropTypes.any,
    rightContent: PropTypes.any,
    leftButtons: PropTypes.array,
    rightButtons: PropTypes.array,

    // left action lifecycle
    onLeftActionActivate: PropTypes.func,
    onLeftActionDeactivate: PropTypes.func,
    onLeftActionRelease: PropTypes.func,
    onLeftActionComplete: PropTypes.func,
    leftActionActivationDistance: PropTypes.number,
    leftActionReleaseAnimationFn: PropTypes.func,
    leftActionReleaseAnimationConfig: PropTypes.object,

    // right action lifecycle
    onRightActionActivate: PropTypes.func,
    onRightActionDeactivate: PropTypes.func,
    onRightActionRelease: PropTypes.func,
    onRightActionComplete: PropTypes.func,
    rightActionActivationDistance: PropTypes.number,
    rightActionReleaseAnimationFn: PropTypes.func,
    rightActionReleaseAnimationConfig: PropTypes.object,

    // left buttons lifecycle
    onLeftButtonsActivate: PropTypes.func,
    onLeftButtonsDeactivate: PropTypes.func,
    onLeftButtonsOpenRelease: PropTypes.func,
    onLeftButtonsOpenComplete: PropTypes.func,
    onLeftButtonsCloseRelease: PropTypes.func,
    onLeftButtonsCloseComplete: PropTypes.func,
    leftButtonWidth: PropTypes.number,
    leftButtonsActivationDistance: PropTypes.number,
    leftButtonsOpenReleaseAnimationFn: PropTypes.func,
    leftButtonsOpenReleaseAnimationConfig: PropTypes.object,
    leftButtonsCloseReleaseAnimationFn: PropTypes.func,
    leftButtonsCloseReleaseAnimationConfig: PropTypes.object,

    // right buttons lifecycle
    onRightButtonsActivate: PropTypes.func,
    onRightButtonsDeactivate: PropTypes.func,
    onRightButtonsOpenRelease: PropTypes.func,
    onRightButtonsOpenComplete: PropTypes.func,
    onRightButtonsCloseRelease: PropTypes.func,
    onRightButtonsCloseComplete: PropTypes.func,
    rightButtonWidth: PropTypes.number,
    rightButtonsActivationDistance: PropTypes.number,
    rightButtonsOpenReleaseAnimationFn: PropTypes.func,
    rightButtonsOpenReleaseAnimationConfig: PropTypes.object,
    rightButtonsCloseReleaseAnimationFn: PropTypes.func,
    rightButtonsCloseReleaseAnimationConfig: PropTypes.object,

    // base swipe lifecycle
    onSwipeStart: PropTypes.func,
    onSwipeMove: PropTypes.func,
    onSwipeRelease: PropTypes.func,
    onSwipeComplete: PropTypes.func,
    swipeReleaseAnimationFn: PropTypes.func,
    swipeReleaseAnimationConfig: PropTypes.object,

    // misc
    onRef: PropTypes.func,
    onPanAnimatedValueRef: PropTypes.func,
    swipeStartMinDistance: PropTypes.number,
    swipeStartMinLeftEdgeClearance: PropTypes.number,
    swipeStartMinRightEdgeClearance: PropTypes.number,
    disable: PropTypes.bool,

    // styles
    style: ViewPropTypes.style,
    leftContainerStyle: ViewPropTypes.style,
    leftButtonContainerStyle: ViewPropTypes.style,
    rightContainerStyle: ViewPropTypes.style,
    rightButtonContainerStyle: ViewPropTypes.style,
    contentContainerStyle: ViewPropTypes.style
  };

  static defaultProps = {
    leftContent: null,
    rightContent: null,
    leftButtons: null,
    rightButtons: null,

    // left action lifecycle
    onLeftActionActivate: noop,
    onLeftActionDeactivate: noop,
    onLeftActionRelease: noop,
    onLeftActionComplete: noop,
    leftActionActivationDistance: 125,
    leftActionReleaseAnimationFn: null,
    leftActionReleaseAnimationConfig: null,

    // right action lifecycle
    onRightActionActivate: noop,
    onRightActionDeactivate: noop,
    onRightActionRelease: noop,
    onRightActionComplete: noop,
    rightActionActivationDistance: 125,
    rightActionReleaseAnimationFn: null,
    rightActionReleaseAnimationConfig: null,

    // left buttons lifecycle
    onLeftButtonsActivate: noop,
    onLeftButtonsDeactivate: noop,
    onLeftButtonsOpenRelease: noop,
    onLeftButtonsOpenComplete: noop,
    onLeftButtonsCloseRelease: noop,
    onLeftButtonsCloseComplete: noop,
    leftButtonWidth: 75,
    leftButtonsActivationDistance: 75,
    leftButtonsOpenReleaseAnimationFn: null,
    leftButtonsOpenReleaseAnimationConfig: null,
    leftButtonsCloseReleaseAnimationFn: null,
    leftButtonsCloseReleaseAnimationConfig: null,

    // right buttons lifecycle
    onRightButtonsActivate: noop,
    onRightButtonsDeactivate: noop,
    onRightButtonsOpenRelease: noop,
    onRightButtonsOpenComplete: noop,
    onRightButtonsCloseRelease: noop,
    onRightButtonsCloseComplete: noop,
    rightButtonWidth: 75,
    rightButtonsActivationDistance: 75,
    rightButtonsOpenReleaseAnimationFn: null,
    rightButtonsOpenReleaseAnimationConfig: null,
    rightButtonsCloseReleaseAnimationFn: null,
    rightButtonsCloseReleaseAnimationConfig: null,

    // base swipe lifecycle
    onSwipeStart: noop,
    onSwipeMove: noop,
    onSwipeRelease: noop,
    onSwipeComplete: noop,
    swipeReleaseAnimationFn: Animated.timing,
    swipeReleaseAnimationConfig: {
      toValue: {x: 0, y: 0},
      duration: 250,
      easing: Easing.elastic(0.5),
      useNativeDriver: false
    },

    // misc
    onRef: noop,
    onPanAnimatedValueRef: noop,
    swipeStartMinDistance: 15,
    swipeStartMinLeftEdgeClearance: 0,
    swipeStartMinRightEdgeClearance: 0,
    bounceOnMount: false,
    disable: false,
  };

  state = {
    pan: new Animated.ValueXY(),
    width: 0,
    lastOffset: {x: 0, y: 0},
    leftActionActivated: false,
    leftButtonsActivated: false,
    leftButtonsOpen: false,
    rightActionActivated: false,
    rightButtonsActivated: false,
    rightButtonsOpen: false
  };

  componentDidMount() {
    const {onPanAnimatedValueRef, onRef} = this.props;

    onRef(this);
    onPanAnimatedValueRef(this.state.pan);
  }

  componentDidMount() {
    if (this.props.bounceOnMount) {
      setTimeout(this._bounceOnMount, 700);
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  recenter = (
    animationFn = this.props.swipeReleaseAnimationFn,
    animationConfig = this.props.swipeReleaseAnimationConfig,
    onDone
  ) => {
    const {pan} = this.state;

    this.setState({
      lastOffset: {x: 0, y: 0},
      leftActionActivated: false,
      leftButtonsActivated: false,
      leftButtonsOpen: false,
      rightActionActivated: false,
      rightButtonsActivated: false,
      rightButtonsOpen: false
    });

    pan.flattenOffset();

    animationFn(pan, animationConfig).start(onDone);
  };

  _bounceOnMount = () => {
    if (this._canSwipeLeft()) {
      this.bounceRight(this.bounceLeft);
    } else if (this._canSwipeRight()) {
      this.bounceLeft();
    }
  };

  bounceRight = (onDone) => {
    if (this._canSwipeLeft()) {
      this.setState({
        rightActionActivated: true,
        rightButtonsActivated: true,
        rightButtonsOpen: true
      });
      this._bounce({x: -50, y: 0}, onDone);
    }
  };

  bounceLeft = (onDone) => {
    if (this._canSwipeRight()) {
      this.setState({
        leftActionActivated: true,
        leftButtonsActivated: true,
        leftButtonsOpen: true
      });
      this._bounce({x: 50, y: 0}, onDone);
    }
  };

  _bounce = (toValue, onDone) => {
    const {pan} = this.state;
    pan.flattenOffset();

    const {swipeReleaseAnimationFn, swipeReleaseAnimationConfig} = this.props;
    Animated.timing(pan, {
      toValue,
      duration: 250,
      easing: Easing.elastic(0.5)
    }).start(() => this.recenter(swipeReleaseAnimationFn, swipeReleaseAnimationConfig, () => onDone && onDone()));
  };

  _unmounted = false;

  _handlePan = Animated.event([null, {
    dx: this.state.pan.x,
    dy: this.state.pan.y,
  }], {useNativeDriver: false});

  _handleMoveShouldSetPanResponder = (event, gestureState) => {
    const {swipeStartMinDistance, swipeStartMinLeftEdgeClearance, swipeStartMinRightEdgeClearance} = this.props;
    const gestureStartX = gestureState.moveX - gestureState.dx;
    return Math.abs(gestureState.dx) > swipeStartMinDistance
      && (swipeStartMinLeftEdgeClearance === 0
        || gestureStartX >= swipeStartMinLeftEdgeClearance)
      && (swipeStartMinRightEdgeClearance === 0
        || gestureStartX <= Dimensions.get('window').width - swipeStartMinRightEdgeClearance);
  };

  _handlePanResponderStart = (event, gestureState) => {
    if (this.props.disable) {
      return;
    }

    const {lastOffset, pan} = this.state;

    pan.setOffset(lastOffset);
    this.props.onSwipeStart(event, gestureState, this);
  };

  _handlePanResponderMove = (event, gestureState) => {
    if (this.props.disable) {
      return;
    }

    const {
      leftActionActivationDistance,
      leftButtonsActivationDistance,
      onLeftActionActivate,
      onLeftActionDeactivate,
      onLeftButtonsActivate,
      onLeftButtonsDeactivate,
      rightActionActivationDistance,
      rightButtonsActivationDistance,
      onRightActionActivate,
      onRightActionDeactivate,
      onRightButtonsActivate,
      onRightButtonsDeactivate,
      onSwipeMove
    } = this.props;
    const {
      lastOffset,
      leftActionActivated,
      leftButtonsActivated,
      rightActionActivated,
      rightButtonsActivated
    } = this.state;
    const {dx, vx} = gestureState;
    const x = dx + lastOffset.x;
    const canSwipeRight = this._canSwipeRight();
    const canSwipeLeft = this._canSwipeLeft();
    const hasLeftButtons = this._hasLeftButtons();
    const hasRightButtons = this._hasRightButtons();
    const isSwipingLeft = vx < 0;
    const isSwipingRight = vx > 0;
    let nextLeftActionActivated = leftActionActivated;
    let nextLeftButtonsActivated = leftButtonsActivated;
    let nextRightActionActivated = rightActionActivated;
    let nextRightButtonsActivated = rightButtonsActivated;

    this._handlePan(event, gestureState);
    onSwipeMove(event, gestureState, this);

    if (!leftActionActivated && canSwipeRight && x >= leftActionActivationDistance) {
      nextLeftActionActivated = true;
      onLeftActionActivate(event, gestureState, this);
    }

    if (leftActionActivated && canSwipeRight && x < leftActionActivationDistance) {
      nextLeftActionActivated = false;
      onLeftActionDeactivate(event, gestureState, this);
    }

    if (!rightActionActivated && canSwipeLeft && x <= -rightActionActivationDistance) {
      nextRightActionActivated = true;
      onRightActionActivate(event, gestureState, this);
    }

    if (rightActionActivated && canSwipeLeft && x > -rightActionActivationDistance) {
      nextRightActionActivated = false;
      onRightActionDeactivate(event, gestureState, this);
    }

    if (!leftButtonsActivated && hasLeftButtons && !isSwipingLeft && x >= leftButtonsActivationDistance) {
      nextLeftButtonsActivated = true;
      onLeftButtonsActivate(event, gestureState, this);
    }

    if (leftButtonsActivated && hasLeftButtons && isSwipingLeft) {
      nextLeftButtonsActivated = false;
      onLeftButtonsDeactivate(event, gestureState, this);
    }

    if (!rightButtonsActivated && hasRightButtons && !isSwipingRight && x <= -rightButtonsActivationDistance) {
      nextRightButtonsActivated = true;
      onRightButtonsActivate(event, gestureState, this);
    }

    if (rightButtonsActivated && hasRightButtons && isSwipingRight) {
      nextRightButtonsActivated = false;
      onRightButtonsDeactivate(event, gestureState, this);
    }

    const needsUpdate =
      nextLeftActionActivated !== leftActionActivated ||
      nextLeftButtonsActivated !== leftButtonsActivated ||
      nextRightActionActivated !== rightActionActivated ||
      nextRightButtonsActivated !== rightButtonsActivated;

    if (needsUpdate) {
      this.setState({
        leftActionActivated: nextLeftActionActivated,
        leftButtonsActivated: nextLeftButtonsActivated,
        rightActionActivated: nextRightActionActivated,
        rightButtonsActivated: nextRightButtonsActivated
      });
    }
  };

  _handlePanResponderEnd = (event, gestureState) => {
    if (this.props.disable) {
      return;
    }

    const {
      onLeftActionRelease,
      onLeftActionDeactivate,
      onLeftButtonsOpenRelease,
      onLeftButtonsCloseRelease,
      onRightActionRelease,
      onRightActionDeactivate,
      onRightButtonsOpenRelease,
      onRightButtonsCloseRelease,
      onSwipeRelease
    } = this.props;
    const {
      leftActionActivated,
      leftButtonsOpen,
      leftButtonsActivated,
      rightActionActivated,
      rightButtonsOpen,
      rightButtonsActivated,
      pan
    } = this.state;
    const animationFn = this._getReleaseAnimationFn();
    const animationConfig = this._getReleaseAnimationConfig();

    onSwipeRelease(event, gestureState, this);

    if (leftActionActivated) {
      onLeftActionRelease(event, gestureState, this);
    }

    if (rightActionActivated) {
      onRightActionRelease(event, gestureState, this);
    }

    if (leftButtonsActivated && !leftButtonsOpen) {
      onLeftButtonsOpenRelease(event, gestureState, this);
    }

    if (!leftButtonsActivated && leftButtonsOpen) {
      onLeftButtonsCloseRelease(event, gestureState, this);
    }

    if (rightButtonsActivated && !rightButtonsOpen) {
      onRightButtonsOpenRelease(event, gestureState, this);
    }

    if (!rightButtonsActivated && rightButtonsOpen) {
      onRightButtonsCloseRelease(event, gestureState, this);
    }

    this.setState({
      lastOffset: {x: animationConfig.toValue.x, y: animationConfig.toValue.y},
      leftActionActivated: false,
      rightActionActivated: false,
      leftButtonsOpen: leftButtonsActivated,
      rightButtonsOpen: rightButtonsActivated
    });

    pan.flattenOffset();

    animationFn(pan, animationConfig).start(() => {
      if (this._unmounted) {
        return;
      }

      const {
        onLeftActionComplete,
        onLeftButtonsOpenComplete,
        onLeftButtonsCloseComplete,
        onRightActionComplete,
        onRightButtonsOpenComplete,
        onRightButtonsCloseComplete,
        onSwipeComplete
      } = this.props;

      onSwipeComplete(event, gestureState, this);

      if (leftActionActivated) {
        onLeftActionComplete(event, gestureState, this);
        onLeftActionDeactivate(event, gestureState, this);
      }

      if (rightActionActivated) {
        onRightActionComplete(event, gestureState, this);
        onRightActionDeactivate(event, gestureState, this);
      }

      if (leftButtonsActivated && !leftButtonsOpen) {
        onLeftButtonsOpenComplete(event, gestureState, this);
      }

      if (!leftButtonsActivated && leftButtonsOpen) {
        onLeftButtonsCloseComplete(event, gestureState, this);
      }

      if (rightButtonsActivated && !rightButtonsOpen) {
        onRightButtonsOpenComplete(event, gestureState, this);
      }

      if (!rightButtonsActivated && rightButtonsOpen) {
        onRightButtonsCloseComplete(event, gestureState, this);
      }
    });
  };

  _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
    onMoveShouldSetPanResponderCapture: this._handleMoveShouldSetPanResponder,
    onPanResponderGrant: this._handlePanResponderStart,
    onPanResponderMove: this._handlePanResponderMove,
    onPanResponderRelease: this._handlePanResponderEnd,
    onPanResponderTerminate: this._handlePanResponderEnd,
    onPanResponderTerminationRequest: this._handlePanResponderEnd
  });

  _handleLayout = ({nativeEvent: {layout: {width}}}) => this.setState({width});

  _canSwipeRight() {
    return this.props.leftContent || this._hasLeftButtons();
  }

  _canSwipeLeft() {
    return this.props.rightContent || this._hasRightButtons();
  }

  _hasLeftButtons() {
    const {leftButtons, leftContent} = this.props;

    return !leftContent && leftButtons && leftButtons.length;
  }

  _hasRightButtons() {
    const {rightButtons, rightContent} = this.props;

    return !rightContent && rightButtons && rightButtons.length;
  }

  _getReleaseAnimationFn() {
    const {
      leftActionReleaseAnimationFn,
      leftButtonsOpenReleaseAnimationFn,
      leftButtonsCloseReleaseAnimationFn,
      rightActionReleaseAnimationFn,
      rightButtonsOpenReleaseAnimationFn,
      rightButtonsCloseReleaseAnimationFn,
      swipeReleaseAnimationFn
    } = this.props;
    const {
      leftActionActivated,
      leftButtonsActivated,
      leftButtonsOpen,
      rightActionActivated,
      rightButtonsActivated,
      rightButtonsOpen
    } = this.state;

    if (leftActionActivated && leftActionReleaseAnimationFn) {
      return leftActionReleaseAnimationFn;
    }

    if (rightActionActivated && rightActionReleaseAnimationFn) {
      return rightActionReleaseAnimationFn;
    }

    if (leftButtonsActivated && leftButtonsOpenReleaseAnimationFn) {
      return leftButtonsOpenReleaseAnimationFn;
    }

    if (!leftButtonsActivated && leftButtonsOpen && leftButtonsCloseReleaseAnimationFn) {
      return leftButtonsCloseReleaseAnimationFn;
    }

    if (rightButtonsActivated && rightButtonsOpenReleaseAnimationFn) {
      return rightButtonsOpenReleaseAnimationFn;
    }

    if (!rightButtonsActivated && rightButtonsOpen && rightButtonsCloseReleaseAnimationFn) {
      return rightButtonsCloseReleaseAnimationFn;
    }

    return swipeReleaseAnimationFn;
  }

  _getReleaseAnimationConfig() {
    const {
      leftActionReleaseAnimationConfig,
      leftButtons,
      leftButtonsOpenReleaseAnimationConfig,
      leftButtonsCloseReleaseAnimationConfig,
      leftButtonWidth,
      rightActionReleaseAnimationConfig,
      rightButtons,
      rightButtonsOpenReleaseAnimationConfig,
      rightButtonsCloseReleaseAnimationConfig,
      rightButtonWidth,
      swipeReleaseAnimationConfig
    } = this.props;
    const {
      leftActionActivated,
      leftButtonsActivated,
      leftButtonsOpen,
      rightActionActivated,
      rightButtonsActivated,
      rightButtonsOpen
    } = this.state;

    if (leftActionActivated && leftActionReleaseAnimationConfig) {
      return leftActionReleaseAnimationConfig;
    }

    if (rightActionActivated && rightActionReleaseAnimationConfig) {
      return rightActionReleaseAnimationConfig;
    }

    if (leftButtonsActivated) {
      return {
        ...swipeReleaseAnimationConfig,
        toValue: {
          x: leftButtons.length * leftButtonWidth,
          y: 0
        },
        ...leftButtonsOpenReleaseAnimationConfig
      };
    }

    if (rightButtonsActivated) {
      return {
        ...swipeReleaseAnimationConfig,
        toValue: {
          x: rightButtons.length * rightButtonWidth * -1,
          y: 0
        },
        ...rightButtonsOpenReleaseAnimationConfig
      };
    }

    if (!leftButtonsActivated && leftButtonsOpen && leftButtonsCloseReleaseAnimationConfig) {
      return leftButtonsCloseReleaseAnimationConfig;
    }

    if (!rightButtonsActivated && rightButtonsOpen && rightButtonsCloseReleaseAnimationConfig) {
      return rightButtonsCloseReleaseAnimationConfig;
    }

    return swipeReleaseAnimationConfig;
  }

  _renderButtons(buttons, isLeftButtons) {
    const {leftButtonContainerStyle, rightButtonContainerStyle} = this.props;
    const {pan, width} = this.state;
    const canSwipeLeft = this._canSwipeLeft();
    const canSwipeRight = this._canSwipeRight();
    const count = buttons.length;
    const leftEnd = canSwipeLeft ? -width : 0;
    const rightEnd = canSwipeRight ? width : 0;
    const inputRange = isLeftButtons ? [0, rightEnd] : [leftEnd, 0];

    return buttons.map((buttonContent, index) => {
      const outputMultiplier = -index / count;
      const outputRange = isLeftButtons ? [0, rightEnd * outputMultiplier] : [leftEnd * outputMultiplier, 0];
      const transform = [{
        translateX: pan.x.interpolate({
          inputRange,
          outputRange,
          extrapolate: 'clamp'
        })
      }];
      const buttonStyle = [
        StyleSheet.absoluteFill,
        {width, transform},
        isLeftButtons ? leftButtonContainerStyle : rightButtonContainerStyle
      ];

      return (
        <Animated.View key={index} style={buttonStyle}>
          {buttonContent}
        </Animated.View>
      );
    });
  }

  render() {
    const {
      children,
      contentContainerStyle,
      leftButtons,
      leftContainerStyle,
      leftContent,
      rightButtons,
      rightContainerStyle,
      rightContent,
      style,
      ...props
    } = this.props;
    const {pan, width} = this.state;
    const canSwipeLeft = this._canSwipeLeft();
    const canSwipeRight = this._canSwipeRight();
    const transform = [{
      translateX: pan.x.interpolate({
        inputRange: [canSwipeLeft ? -width : 0, canSwipeRight ? width : 0],
        outputRange: [
          canSwipeLeft ? -width + StyleSheet.hairlineWidth : 0,
          canSwipeRight ? width - StyleSheet.hairlineWidth : 0
        ],
        extrapolate: 'clamp'
      })
    }];

    return (
      <View onLayout={this._handleLayout} style={[styles.container, style]} {...this._panResponder.panHandlers} {...props}>
        {canSwipeRight && (
          <Animated.View style={[{transform, marginLeft: -width, width}, leftContainerStyle]}>
            {leftContent || this._renderButtons(leftButtons, true)}
          </Animated.View>
        )}
        <Animated.View style={[{transform}, styles.content, contentContainerStyle]}>{children}</Animated.View>
        {canSwipeLeft && (
          <Animated.View style={[{transform, marginRight: -width, width}, rightContainerStyle]}>
            {rightContent || this._renderButtons(rightButtons, false)}
          </Animated.View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  content: {
    flex: 1
  }
});
