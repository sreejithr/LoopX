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
import Video from 'react-native-video';

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

    fetch("http://nonstopp.in:5000/g2QJ3IlJLi0").then(resp => {
      if (resp.status === 200) {
        resp.text().then(data => {
          var json = JSON.parse(data);
          console.log(json);
        });
      }
    });
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
        <Video source={{uri: this.state.videoURL}}
         rate={1.0}                   // 0 is paused, 1 is normal.
         volume={1.0}                 // 0 is muted, 1 is normal.
         muted={false}                // Mutes the audio entirely.
         paused={false}               // Pauses playback entirely.
         
         repeat={true}                // Repeat forever.
         onLoadStart={this.loadStart} // Callback when video starts to load
         onLoad={this.setDuration}    // Callback when video loads
         onProgress={this.setTime}    // Callback every ~250ms with currentTime
         onEnd={this.onEnd}           // Callback when playback finishes
         onError={this.videoError}    // Callback when video cannot be loaded
      />
      </View>
    );
  }
}
