/**
 * Player Component
 */

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  WebView,
  StyleSheet
} from 'react-native';
import Orientation from 'react-native-orientation';
import { PlayerManager } from 'NativeModules';

export default class VideoPlayer extends Component {
  static propTypes = {
    url: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      "playing": false,
      "startTime": 0,
      "endTime": 0
    };
  }

  componentDidMount() {
    Orientation.lockToLandscape();
  }

  validateURL(url) {
    // TODO: Check if url actually points to audio file and is reachable.
    // If not, show error (?)
    return url;
  }

  play() {
    var self = this;

    // if (!this.state.playing) {
    //   PlayerManager(this.validateURL(this.props.url), player => {
    //     self.player = player;
    //     self.player.play(self.state.startTime, self.state.endTime);
    //   });
    // }
  }

  stop() {
    if (this.state.playing && this.videoPlayer) {
      this.videoPlayer.stop();
    }
  }

  pause() {
    if (this.state.playing && this.videoPlayer) {
      this.videoPlayer.pause();
    }
  }

  addStart(startTime) {
    this.setState({startTime});
  }

  addEnd(endTime) {
    this.setState({endTime});
  }

  render() {
    return (
      <View>
        <Text>Hello world g2QJ3IlJLi0</Text>
        <WebView source={require('../assets/index.html')}
         style={{width: 500}} />
      </View>
    );
  }
}
