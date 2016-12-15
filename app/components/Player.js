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

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants';
import { Seeker } from './Seeker';

let TITLE_FADE_TIME = 2 * 1000;

export default class VideoPlayer extends Component {
  static propTypes = {
    url: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      startTime: 0,
      endTime: 0,

      titleFade: false,

      url: null,
      title: null,
      author: null
    };
  }

  componentWillMount() {
    Orientation.lockToLandscape();
  }

  componentDidMount() {
    var self = this;
    fetch("http://nonstopp.in:5000/video/g2QJ3IlJLi0").then(resp => {
      if (resp.status === 200) {
        resp.text().then(d => {
          var data = JSON.parse(d);
          console.log(data);
          self.setState({
            url: data.url,
            title: data.title,
            author: data.author
          });
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

  onProgress() {
    
  }

  addEnd(endTime) {
    this.setState({endTime});
  }

  _renderVideo() {
    if (this.state.url) {
      return (
          <Video source={{uri: this.state.url}}
           rate={1.0}                   // 0 is paused, 1 is normal.
           volume={1.0}                 // 0 is muted, 1 is normal.
           muted={false}                // Mutes the audio entirely.
           paused={true}               // Pauses playback entirely.
           resizeMode="cover"           // Fill the whole screen at aspect ratio.
           repeat={false}                // Repeat forever.
           onLoadStart={this.loadStart} // Callback when video starts to load
           onLoad={this.setDuration}    // Callback when video loads
           onProgress={this.onProgress} // Callback every ~250ms with currentTime
           onEnd={this.onEnd}           // Callback when playback finishes
           onError={this.videoError}    // Callback when video cannot be loaded
           style={styles.video}
          />
      );
    } else {
      return (
        <View style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          backgroundColor: 'black'
        }}></View>
      );
    }
  }

  _renderTitle() {
    if (this.state.titleFade) {
      return <View></View>;
    }

    if (this.state.title) {
      setTimeout(() => this.setState({titleFade: true}), TITLE_FADE_TIME);
      return (
          <View style={styles.title}>
            <Text style={styles.titleText}>
              {this.state.title} - {this.state.author}
            </Text>
          </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderVideo()}
        {this._renderTitle()}
        <View style={styles.seekerWrapper}>
          <Seeker />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  video: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    backgroundColor: 'black'
  },
  title: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    padding: 10
  },
  titleText: {
    color: 'white',
    fontSize: 18
  },
  seekerWrapper: {
    position: 'absolute',
    bottom: 20,
    width: SCREEN_WIDTH,
    paddingHorizontal: 20
  }
});
