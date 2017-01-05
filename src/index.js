import React, {PropTypes, PureComponent} from 'react';
import {Animated, Easing, PanResponder, StyleSheet, View} from 'react-native';

function noop() {}

const animationFnPropType = PropTypes.oneOf([
  Animated.decay,
  Animated.spring,
  Animated.timing
]);

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
    leftActionReleaseAnimationFn: animationFnPropType,
    leftActionReleaseAnimationConfig: PropTypes.object,

    // right action lifecycle
    onRightActionActivate: PropTypes.func,
    onRightActionDeactivate: PropTypes.func,
    onRightActionRelease: PropTypes.func,
    onRightActionComplete: PropTypes.func,
    rightActionActivationDistance: PropTypes.number,
    rightActionReleaseAnimationFn: animationFnPropType,
    rightActionReleaseAnimationConfig: PropTypes.object,

    // left buttons lifecycle
    onLeftButtonsOpenActivate: PropTypes.func,
    onLeftButtonsOpenDeactivate: PropTypes.func,
    onLeftButtonsOpenRelease: PropTypes.func,
    onLeftButtonsOpenComplete: PropTypes.func,
    leftButtonWidth: PropTypes.number,
    leftButtonsOpenActivationDistance: PropTypes.number,
    leftButtonsOpenReleaseAnimationFn: animationFnPropType,
    leftButtonsOpenReleaseAnimationConfig: PropTypes.object,

    // right buttons lifecycle
    onRightButtonsOpenActivate: PropTypes.func,
    onRightButtonsOpenDeactivate: PropTypes.func,
    onRightButtonsOpenComplete: PropTypes.func,
    onRightButtonsOpenRelease: PropTypes.func,
    rightButtonWidth: PropTypes.number,
    rightButtonsOpenActivationDistance: PropTypes.number,
    rightButtonsOpenReleaseAnimationFn: animationFnPropType,
    rightButtonsOpenReleaseAnimationConfig: PropTypes.object,

    // base swipe lifecycle
    onSwipeStart: PropTypes.func,
    onSwipeMove: PropTypes.func,
    onSwipeRelease: PropTypes.func,
    onSwipeComplete: PropTypes.func,
    swipeReleaseAnimationFn: animationFnPropType,
    swipeReleaseAnimationConfig: PropTypes.object,

    // misc
    onRef: PropTypes.func,
    onPanAnimatedValueRef: PropTypes.func,
    swipeStartMinDistance: PropTypes.number,

    // styles
    style: View.propTypes.style,
    leftContainerStyle: View.propTypes.style,
    leftButtonContainerStyle: View.propTypes.style,
    rightContainerStyle: View.propTypes.style,
    rightButtonContainerStyle: View.propTypes.style,
    contentContainerStyle: View.propTypes.style
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
    onLeftButtonsOpenActivate: noop,
    onLeftButtonsOpenDeactivate: noop,
    onLeftButtonsOpenRelease: noop,
    onLeftButtonsOpenComplete: noop,
    leftButtonWidth: 75,
    leftButtonsOpenActivationDistance: 75,
    leftButtonsOpenReleaseAnimationFn: null,
    leftButtonsOpenReleaseAnimationConfig: null,

    // right buttons lifecycle
    onRightButtonsOpenActivate: noop,
    onRightButtonsOpenDeactivate: noop,
    onRightButtonsOpenRelease: noop,
    onRightButtonsOpenComplete: noop,
    rightButtonWidth: 75,
    rightButtonsOpenActivationDistance: 75,
    rightButtonsOpenReleaseAnimationFn: null,
    rightButtonsOpenReleaseAnimationConfig: null,

    // base swipe lifecycle
    onSwipeStart: noop,
    onSwipeMove: noop,
    onSwipeRelease: noop,
    onSwipeComplete: noop,
    swipeReleaseAnimationFn: Animated.timing,
    swipeReleaseAnimationConfig: {
      toValue: {x: 0, y: 0},
      duration: 250,
      easing: Easing.elastic(0.5)
    },

    // misc
    onRef: noop,
    onPanAnimatedValueRef: noop,
    swipeStartMinDistance: 15
  };

  state = {
    pan: new Animated.ValueXY(),
    width: 0,
    lastOffset: {x: 0, y: 0},
    leftActionActivated: false,
    leftButtonsOpenActivated: false,
    rightActionActivated: false,
    rightButtonsOpenActivated: false
  };

  componentWillMount() {
    const {onPanAnimatedValueRef, onRef} = this.props;

    onRef(this);
    onPanAnimatedValueRef(this.state.pan);
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
      leftButtonsOpenActivated: false,
      rightActionActivated: false,
      rightButtonsOpenActivated: false
    });

    pan.flattenOffset();

    animationFn(pan, animationConfig).start(onDone);
  };

  _unmounted = false;

  _handlePan = Animated.event([null, {
    dx: this.state.pan.x,
    dy: this.state.pan.y
  }]);

  _handleMoveShouldSetPanResponder = (event, gestureState) => (
    Math.abs(gestureState.dx) > this.props.swipeStartMinDistance
  );

  _handlePanResponderStart = (event, gestureState) => {
    const {lastOffset, pan} = this.state;

    pan.setOffset(lastOffset);
    this.props.onSwipeStart(event, gestureState);
  };

  _handlePanResponderMove = (event, gestureState) => {
    const {
      leftActionActivationDistance,
      leftButtonsOpenActivationDistance,
      onLeftActionActivate,
      onLeftActionDeactivate,
      onLeftButtonsOpenActivate,
      onLeftButtonsOpenDeactivate,
      rightActionActivationDistance,
      rightButtonsOpenActivationDistance,
      onRightActionActivate,
      onRightActionDeactivate,
      onRightButtonsOpenActivate,
      onRightButtonsOpenDeactivate,
      onSwipeMove
    } = this.props;
    const {
      lastOffset,
      leftActionActivated,
      leftButtonsOpenActivated,
      rightActionActivated,
      rightButtonsOpenActivated
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
    let nextLeftButtonsOpenActivated = leftButtonsOpenActivated;
    let nextRightActionActivated = rightActionActivated;
    let nextRightButtonsOpenActivated = rightButtonsOpenActivated;

    this._handlePan(event, gestureState);
    onSwipeMove(event, gestureState);

    if (!leftActionActivated && canSwipeRight && x >= leftActionActivationDistance) {
      nextLeftActionActivated = true;
      onLeftActionActivate(event, gestureState);
    }

    if (leftActionActivated && canSwipeRight && x < leftActionActivationDistance) {
      nextLeftActionActivated = false;
      onLeftActionDeactivate(event, gestureState);
    }

    if (!rightActionActivated && canSwipeLeft && x <= -rightActionActivationDistance) {
      nextRightActionActivated = true;
      onRightActionActivate(event, gestureState);
    }

    if (rightActionActivated && canSwipeLeft && x > -rightActionActivationDistance) {
      nextRightActionActivated = false;
      onRightActionDeactivate(event, gestureState);
    }

    if (!leftButtonsOpenActivated && hasLeftButtons && !isSwipingLeft && x >= leftButtonsOpenActivationDistance) {
      nextLeftButtonsOpenActivated = true;
      onLeftButtonsOpenActivate(event, gestureState);
    }

    if (leftButtonsOpenActivated && hasLeftButtons && isSwipingLeft) {
      nextLeftButtonsOpenActivated = false;
      onLeftButtonsOpenDeactivate(event, gestureState);
    }

    if (!rightButtonsOpenActivated && hasRightButtons && !isSwipingRight && x <= -rightButtonsOpenActivationDistance) {
      nextRightButtonsOpenActivated = true;
      onRightButtonsOpenActivate(event, gestureState);
    }

    if (rightButtonsOpenActivated && hasRightButtons && isSwipingRight) {
      nextRightButtonsOpenActivated = false;
      onRightButtonsOpenDeactivate(event, gestureState);
    }

    const needsUpdate =
      nextLeftActionActivated !== leftActionActivated ||
      nextLeftButtonsOpenActivated !== leftButtonsOpenActivated ||
      nextRightActionActivated !== rightActionActivated ||
      nextRightButtonsOpenActivated !== rightButtonsOpenActivated;

    if (needsUpdate) {
      this.setState({
        leftActionActivated: nextLeftActionActivated,
        leftButtonsOpenActivated: nextLeftButtonsOpenActivated,
        rightActionActivated: nextRightActionActivated,
        rightButtonsOpenActivated: nextRightButtonsOpenActivated
      });
    }
  };

  _handlePanResponderEnd = (event, gestureState) => {
    const {
      onLeftActionDeactivate,
      onLeftActionRelease,
      onLeftButtonsOpenRelease,
      onRightActionDeactivate,
      onRightActionRelease,
      onRightButtonsOpenRelease,
      onSwipeRelease
    } = this.props;
    const {
      leftActionActivated,
      leftButtonsOpenActivated,
      rightActionActivated,
      rightButtonsOpenActivated,
      pan
    } = this.state;
    const animationFn = this._getReleaseAnimationFn();
    const animationConfig = this._getReleaseAnimationConfig();

    onSwipeRelease(event, gestureState);

    if (leftActionActivated) {
      onLeftActionRelease(event, gestureState);
    }

    if (leftButtonsOpenActivated) {
      onLeftButtonsOpenRelease(event, gestureState);
    }

    if (rightActionActivated) {
      onRightActionRelease(event, gestureState);
    }

    if (rightButtonsOpenActivated) {
      onRightButtonsOpenRelease(event, gestureState);
    }

    this.setState({
      lastOffset: {x: animationConfig.toValue.x, y: animationConfig.toValue.y},
      leftActionActivated: false,
      rightActionActivated: false
    });

    pan.flattenOffset();

    animationFn(pan, animationConfig).start(() => {
      if (this._unmounted) {
        return;
      }

      const {
        onLeftButtonsOpenComplete,
        onRightButtonsOpenComplete,
        onLeftActionComplete,
        onRightActionComplete,
        onSwipeComplete
      } = this.props;

      onSwipeComplete(event, gestureState);

      if (leftActionActivated) {
        onLeftActionComplete(event, gestureState);
        onLeftActionDeactivate(event, gestureState);
      }

      if (leftButtonsOpenActivated) {
        onLeftButtonsOpenComplete(event, gestureState);
      }

      if (rightActionActivated) {
        onRightActionComplete(event, gestureState);
        onRightActionDeactivate(event, gestureState);
      }

      if (rightButtonsOpenActivated) {
        onRightButtonsOpenComplete(event, gestureState);
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
      rightActionReleaseAnimationFn,
      rightButtonsOpenReleaseAnimationFn,
      swipeReleaseAnimationFn
    } = this.props;
    const {
      leftActionActivated,
      leftButtonsOpenActivated,
      rightActionActivated,
      rightButtonsOpenActivated
    } = this.state;

    if (leftActionActivated && leftActionReleaseAnimationFn) {
      return leftActionReleaseAnimationFn;
    }

    if (rightActionActivated && rightActionReleaseAnimationFn) {
      return rightActionReleaseAnimationFn;
    }

    if (leftButtonsOpenActivated && leftButtonsOpenReleaseAnimationFn) {
      return leftButtonsOpenReleaseAnimationFn;
    }

    if (rightButtonsOpenActivated && rightButtonsOpenReleaseAnimationFn) {
      return rightButtonsOpenReleaseAnimationFn;
    }

    return swipeReleaseAnimationFn;
  }

  _getReleaseAnimationConfig() {
    const {
      leftActionReleaseAnimationConfig,
      leftButtons,
      leftButtonsOpenReleaseAnimationConfig,
      leftButtonWidth,
      rightActionReleaseAnimationConfig,
      rightButtons,
      rightButtonsOpenReleaseAnimationConfig,
      rightButtonWidth,
      swipeReleaseAnimationConfig
    } = this.props;
    const {
      leftActionActivated,
      leftButtonsOpenActivated,
      rightActionActivated,
      rightButtonsOpenActivated
    } = this.state;

    if (leftActionActivated && leftActionReleaseAnimationConfig) {
      return leftActionReleaseAnimationConfig;
    }

    if (rightActionActivated && rightActionReleaseAnimationConfig) {
      return rightActionReleaseAnimationConfig;
    }

    if (leftButtonsOpenActivated) {
      return {
        ...swipeReleaseAnimationConfig,
        toValue: {
          x: leftButtons.length * leftButtonWidth,
          y: 0
        },
        ...leftButtonsOpenReleaseAnimationConfig
      };
    }

    if (rightButtonsOpenActivated) {
      return {
        ...swipeReleaseAnimationConfig,
        toValue: {
          x: rightButtons.length * rightButtonWidth * -1,
          y: 0
        },
        ...rightButtonsOpenReleaseAnimationConfig
      };
    }

    return swipeReleaseAnimationConfig;
  }

  _renderButtons(buttons, isLeftButtons) {
    const {leftButtonContainerStyle, rightButtonContainerStyle} = this.props;
    const {pan, width} = this.state;
    const canSwipeLeft = this._canSwipeLeft();
    const canSwipeRight = this._canSwipeRight();
    const count = buttons.length;
    const inputRange = isLeftButtons ?
      [0, canSwipeRight ? width : 0] :
      [canSwipeLeft ? -width : 0, 0];

    return buttons.map((buttonContent, index) => {
      const outputMultiplier = -index / count;
      const outputRange = isLeftButtons ?
        [0, (canSwipeRight ? width : 0) * outputMultiplier] :
        [(canSwipeLeft ? -width : 0) * outputMultiplier, 0];

      const buttonStyle = [
        StyleSheet.absoluteFill,
        {
          width,
          transform: [{
            translateX: pan.x.interpolate({
              inputRange,
              outputRange,
              extrapolate: 'clamp'
            })
          }]
        },
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
    const containerStyle = [
      {
        transform: [{
          translateX: pan.x.interpolate({
            inputRange: [canSwipeLeft ? -width : 0, canSwipeRight ? width : 0],
            outputRange: [
              canSwipeLeft ? -width + StyleSheet.hairlineWidth : 0,
              canSwipeRight ? width - StyleSheet.hairlineWidth : 0
            ],
            extrapolate: 'clamp'
          })
        }]
      },
      styles.container,
      style
    ];

    return (
      <Animated.View onLayout={this._handleLayout} style={containerStyle} {...this._panResponder.panHandlers} {...props}>
        {canSwipeRight && (
          <View style={[{marginLeft: -width, width}, leftContainerStyle]}>
            {leftContent || this._renderButtons(leftButtons, true)}
          </View>
        )}
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
        {canSwipeLeft && (
          <View style={[{marginRight: -width, width}, rightContainerStyle]}>
            {rightContent || this._renderButtons(rightButtons, false)}
          </View>
        )}
      </Animated.View>
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
