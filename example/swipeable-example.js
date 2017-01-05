import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Swipeable from 'react-native-swipeable';

export default function SwipeableExample() {
  return (
    <View style={styles.container}>
      <Example1/>
      <Example2/>
      <Example3/>
    </View>
  );
}

function Example1() {
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
    >
      <View style={[styles.listItem, {backgroundColor: 'salmon'}]}>
        <Text>Example 1</Text>
      </View>
    </Swipeable>
  );
}

function Example2() {
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
        onLeftActionActivate={() => this.setState({leftActionActivated: true})}
        onLeftActionDeactivate={() => this.setState({leftActionActivated: false})}
        onLeftActionComplete={() => this.setState({toggle: !toggle})}
        leftActionActivationDistance={200}
        leftContent={(
          <View style={[styles.leftSwipeItem, {backgroundColor: leftActionActivated ? 'lightgoldenrodyellow' : 'steelblue'}]}>
            {leftActionActivated ?
              <Text>release!</Text> :
              <Text>keep pulling!</Text>}
          </View>
        )}
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
