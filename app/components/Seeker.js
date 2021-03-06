/**
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  PanResponder,
  StyleSheet,
  Animated,
  Easing
} from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../constants';

let HANDLE_WIDTH = 40;
let HANDLE_HEIGHT = 30;
let START_HEIGHT = 50;
let END_HEIGHT = 90;

class Handler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      released: false,
      animatedHeight: null,
      defaultHeight: null
    };
  }

  animateHandleRelease() {
    var self = this;
    this.setState({
      released: true,
      animatedHeight: new Animated.Value(this.props.height)
    }, () => {
      if (!self.state.defaultHeight) {
        return;
      }

      Animated.timing(self.state.animatedHeight, {
        toValue: self.state.defaultHeight,
        duration: 200,
        easing: Easing.out(Easing.cubic)
      }).start(() => self.setState({released: false}));
    });
  }

  componentWillMount() {
    var self = this;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        self.setState({defaultHeight: self.props.height});
        self.props.onGestureStart && self.props.onGestureStart(evt, gestureState);
      },
      onPanResponderMove: (evt, gestureState) => {
        self.props.onMove && self.props.onMove(evt, gestureState);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        self.animateHandleRelease();
        self.props.onGestureEnd && self.props.onGestureEnd(evt, gestureState);
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from 
        // becoming the JS responder. Returns true by default. Is currently only
        // supported on android.
        return true;
      }
    });
  }

  render() {
    var height;
    if (this.state.released) {
      height = this.state.animatedHeight;
    } else {
      height = this.props.height || 20;
      height = height < 20 ? 20 : height;
    }

    return (
      <View style={styles.handleContainer}>
        <View style={styles.handle} {...this._panResponder.panHandlers}></View>
        <Animated.View style={[styles.handleStem, {height}]}></Animated.View>
      </View>
    )
  }
}

class Timeline extends Component {
  render() {
    return (
        <View style={styles.timeline}></View>
    );
  }
}

let CONTROLS = {
  START: 'START',
  END: 'END',
  NONE: 'NONE'
}

export class Seeker extends Component {
  constructor(props) {
    super(props);
    this.width = 0;
    this.state = {
      startPos: 0,
      endPos: 10,
      activeControl: CONTROLS.NONE,
      verticalPos: null,
      zoomLevel: new Animated.Value(1)
    };
  }

  limitToRangeX(x) {
    var dx = x < 0 ? 0 : x;
    dx = dx > this.width ? this.width : dx;
    return dx;
  }

  limitToRangeY(y) {
    return y;
  }

  onStartMove(e, gestureState) {
    var startPos = this.limitToRangeX(gestureState.moveX - HANDLE_WIDTH/2);
    if (this.state.activeControl === CONTROLS.START) {
      this.setState({startPos, verticalPos: SCREEN_HEIGHT - gestureState.moveY});
    } else {
      this.setState({startPos});
    }
  }

  onEndMove(e, gestureState) {
    var endPos = this.limitToRangeX(gestureState.moveX - HANDLE_WIDTH/2);
    if (this.state.activeControl === CONTROLS.END) {
      this.setState({endPos, verticalPos: SCREEN_HEIGHT - gestureState.moveY});
    } else {
      this.setState({endPos});
    }
  }

  onLayout(e) {
    this.width = e.nativeEvent.layout.width;
  }

  onGestureStart(e, gestureState, activeControl) {
    this.setState({
      verticalPos: SCREEN_HEIGHT - gestureState.y0,
      activeControl
    });
  }

  animateStartHandleDismiss(onFinish) {
    Animated.timing(this.state.verticalPos, {
      toValue: START_HEIGHT
    }).start(onFinish);
  }

  animateEndHandleDismiss(onFinish) {
    Animated.timing(this.state.verticalPos, {
      toValue: END_HEIGHT
    }).start(onFinish);
  }

  animateHandleDismiss(onFinish) {
    if (this.state.activeControl === CONTROLS.START) {
      this.animateStartHandleDismiss(onFinish);
    } else if (this.state.activeControl === CONTROLS.END) {
      this.animateEndHandleDismiss(onFinish);
    }
  }

  onGestureEnd(e, gestureState, activeControl) {
    this.setState({activeControl: CONTROLS.NONE});
  }

  render() {
    // var zoomLevel = this.state.zoomLevel.interpolate({
    // });
    var startHeight = START_HEIGHT, endHeight = END_HEIGHT;
    if (this.state.verticalPos) {
      if (this.state.activeControl === CONTROLS.START) {
        startHeight = this.state.verticalPos < startHeight ? startHeight : this.state.verticalPos;
      } else if (this.state.activeControl === CONTROLS.END) {
        endHeight = this.state.verticalPos < endHeight ? endHeight : this.state.verticalPos;
      }
    }
    var maxHeight = startHeight > endHeight ? startHeight : endHeight;
    var AnimatedHandle = Animated.createAnimatedComponent(Handler);

    return (
      <View style={styles.container} onLayout={this.onLayout.bind(this)}>

        <View style={{flex: 1, alignItems: 'flex-end', flexDirection: 'row'}}>
          <View style={[styles.handleWrapper, {left: this.state.startPos}]}>
            <Handler height={startHeight}
             onMove={(e, g) => this.onStartMove(e, g, CONTROLS.START)}
             onGestureStart={(e, g) => this.onGestureStart(e, g, CONTROLS.START)}
             onGestureEnd={(e, g) => this.onGestureEnd(e, g, CONTROLS.START)}
             />
          </View>

          <View style={{height: maxHeight, width: 10}}></View>

          <View style={[styles.handleWrapper, {left: this.state.endPos}]}>
            <Handler height={endHeight}
             onMove={(e, g) => this.onEndMove(e, g, CONTROLS.END)}
             onGestureStart={(e, g) => this.onGestureStart(e, g, CONTROLS.END)}
             onGestureEnd={(e, g) => this.onGestureEnd(e, g, CONTROLS.END)}
            />
          </View>
        </View>

        <Timeline />

      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {

  },
  timeline: {
    backgroundColor: 'red',
    height: 1,
    left: 0,
    right: 0
  },
  handleContainer: {
    backgroundColor: 'green',
    position: 'relative'
  },
  handleWrapper: {
    flex: 1,
    position: 'absolute',
    bottom: 0
  },
  handleStem: {
    backgroundColor: 'white',
    height: 20,
    width: 1,
    top: 1,
    bottom: 80
  },
  handle: {
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    position: 'absolute',
    borderColor: 'grey',
    borderWidth: 1,
    transform: [
      {translateX: -20}
    ]
  }
});
