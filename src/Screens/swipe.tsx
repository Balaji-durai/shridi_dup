/*'use strict';
 
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import PlaylistScreen from './MeditationScreen/PlaylistScreen';
 
class SomeComponent extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      backgroundColor: '#fff'
    };
  }
 
  onSwipeUp(gestureState) {
    this.setState({myText: 'You swiped up!'});
    this.setState({backgroundColor: 'red'});
  }
 
  render() {
 
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
 
    return (
      <GestureRecognizer
        onSwipeUp={< PlaylistScreen />}
        config={config}
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor
        }}
        >
        <Text>{this.state.myText}</Text>
        <Text>onSwipe callback received gesture: {this.state.gestureName}</Text>
      </GestureRecognizer>
    );
  }
}
 
export default SomeComponent;



import React from 'react'
import {View, TouchableOpacity, Text, ScrollView} from 'react-native'

import SlidingUpPanel from 'rn-sliding-up-panel'

const styles = {
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc'
  }
}

class ScrollViewInsidePanel extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this._panel.show()}>
          <View>
            <Text>Show</Text>
          </View>
        </TouchableOpacity>
        <SlidingUpPanel ref={c => (this._panel = c)}>
          {dragHandler => (
            <View style={styles.container}>
              <View style={styles.dragHandler} {...dragHandler}>
                <Text>Drag handler</Text>
              </View>
              <ScrollView>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
                <Text>Here is the content inside panel</Text>
              </ScrollView>
            </View>
          )}
        </SlidingUpPanel>
      </View>
    )
  }
}

export default ScrollViewInsidePanel 

 import React from 'react'
import {Text, View, Dimensions} from 'react-native'

import SlidingUpPanel from 'rn-sliding-up-panel'

const {height} = Dimensions.get('window')

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center'
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  panelHeader: {
    height: 120,
    backgroundColor: '#b197fc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: '#2b8a3e',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1
  }
}

class BottomSheet extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello world</Text>
        <SlidingUpPanel
          ref={c => (this._panel = c)}
          draggableRange={{top: height, bottom: 120}}
          animatedValue={this._draggedValue}
          showBackdrop={false}>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <Text style={{color: '#FFF'}}>Bottom Sheet Peek</Text>
            </View>
            <View style={styles.container}>
              <Text>Bottom Sheet Content</Text>
            </View>
          </View>
        </SlidingUpPanel>
      </View>
    )
  }
}

export default BottomSheet */
