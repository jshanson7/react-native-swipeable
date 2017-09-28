import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Swipeable from 'react-native-swipeable';

export default class SwipeableExample extends Component {

  state = {
    currentlyOpenSwipeable: null
  };

  handleScroll = () => {
    const {currentlyOpenSwipeable} = this.state;

    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
  };

  render() {
    const {currentlyOpenSwipeable} = this.state;
    const itemProps = {
      onOpen: (event, gestureState, swipeable) => {
        if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
          currentlyOpenSwipeable.recenter();
        }

        this.setState({currentlyOpenSwipeable: swipeable});
      },
      onClose: () => this.setState({currentlyOpenSwipeable: null})
    };

    return (
      <ScrollView onScroll={this.handleScroll} style={styles.container}>
        <Example1 {...itemProps}/>
        <Example2 {...itemProps}/>
        <Example3 {...itemProps}/>
      </ScrollView>
    );
  }
}

function Example1({onOpen, onClose}) {
  return (
    <Swipeable
      leftContent={(
        <View style={[styles.leftSwipeItem, {backgroundColor: 'lightskyblue'}]}>
          <Text>Pull action</Text>
        </View>
      )}
      rightButtons={[
        <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: 'lightseagreen'}]}>
          <Text>1</Text>
        </TouchableOpacity>,
        <TouchableOpacity style={[styles.rightSwipeItem, {backgroundColor: 'orchid'}]}>
          <Text>2</Text>
        </TouchableOpacity>
      ]}
      onRightButtonsOpenRelease={onOpen}
      onRightButtonsCloseRelease={onClose}
      swipeStartMinLeftEdgeClearance={10}
      swipeStartMinRightEdgeClearance={10}
    >
      <View style={[styles.listItem, {backgroundColor: 'salmon'}]}>
        <Text>Example 1</Text>
      </View>
    </Swipeable>
  );
}

function Example2({onOpen, onClose}) {
  return (
    <Swipeable
      leftButtonWidth={45}
      leftButtons={[
        <TouchableOpacity style={[styles.leftSwipeItem, {backgroundColor: 'papayawhip'}]}>
          <Text>1</Text>
        </TouchableOpacity>,
        <TouchableOpacity style={[styles.leftSwipeItem, {backgroundColor: 'olivedrab'}]}>
          <Text>2</Text>
        </TouchableOpacity>,
        <TouchableOpacity style={[styles.leftSwipeItem, {backgroundColor: 'mistyrose'}]}>
          <Text>3</Text>
        </TouchableOpacity>,
        <TouchableOpacity style={[styles.leftSwipeItem, {backgroundColor: 'mediumaquamarine'}]}>
          <Text>4</Text>
        </TouchableOpacity>,
        <TouchableOpacity style={[styles.leftSwipeItem, {backgroundColor: 'lightslategray'}]}>
          <Text>5</Text>
        </TouchableOpacity>,
        <TouchableOpacity style={[styles.leftSwipeItem, {backgroundColor: 'ivory'}]}>
          <Text>6</Text>
        </TouchableOpacity>
      ]}
      rightContent={(
        <View style={[styles.rightSwipeItem, {backgroundColor: 'linen'}]}>
          <Text>Pull action</Text>
        </View>
      )}
      onLeftButtonsOpenRelease={onOpen}
      onLeftButtonsCloseRelease={onClose}
      swipeStartMinLeftEdgeClearance={10}
      swipeStartMinRightEdgeClearance={10}
    >
      <View style={[styles.listItem, {backgroundColor: 'paleturquoise'}]}>
        <Text>Example 2</Text>
      </View>
    </Swipeable>
  );
}

class Example3 extends Component {

  state = {
    leftActionActivated: false,
    toggle: false
  };

  render() {
    const {leftActionActivated, toggle} = this.state;

    return (
      <Swipeable
        leftActionActivationDistance={200}
        leftContent={(
          <View style={[styles.leftSwipeItem, {backgroundColor: leftActionActivated ? 'lightgoldenrodyellow' : 'steelblue'}]}>
            {leftActionActivated ?
              <Text>release!</Text> :
              <Text>keep pulling!</Text>}
          </View>
        )}
        onLeftActionActivate={() => this.setState({leftActionActivated: true})}
        onLeftActionDeactivate={() => this.setState({leftActionActivated: false})}
        onLeftActionComplete={() => this.setState({toggle: !toggle})}
        swipeStartMinLeftEdgeClearance={10}
      >
        <View style={[styles.listItem, {backgroundColor: toggle ? 'thistle' : 'darkseagreen'}]}>
          <Text>Example 3</Text>
        </View>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  listItem: {
    height: 75,
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftSwipeItem: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20
  },
  rightSwipeItem: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20
  },

});
