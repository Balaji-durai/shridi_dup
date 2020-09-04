import React,{ Component } from 'react';
import { View, StyleSheet} from 'react-native';
import TrackPlayer from "react-native-track-player";
import  Player  from './Player';

class MusicPlayerComponent extends Component {
  
    constructor(props) {
      super(props);
      this.state = {
        // get the player stopTime(Hour,Minute,Seconds) from meditation home screen through meditation audion screen by prop drilling
        Hour: this.props.value.Hour,
        Minute: this.props.value.Minute,
        Seconds: this.props.value.Seconds,
        PlaylistData: []
      }

      //event listener called when the playback queue ended
      TrackPlayer.addEventListener('playback-queue-ended', async()=> {
          await this.setState({PlaylistData: []});                         //clear the playlist data state otherwise it cause error on re-render
          await this.connectApi();                                         //then get the data from server
          await TrackPlayer.add(this.state.PlaylistData[1]);               //then set data in state  array index 1 because we cannot use spread operator in rewrite the state 
          await TrackPlayer.play();                                        //play the songs
      }) 
    }

    //initialize the player and setup the player when component render
    componentDidMount() {
      this.setup();
      this.playOnInit();
    }
    
   /* componentWillUnmount() {
      this.setState({PlaylistData: []})
      console.log('cleared playlistdata:',this.state.PlaylistData)
    } */
  
    //setup the player configuration when component renders
    setup= async () => {
      await TrackPlayer.setupPlayer({});
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          TrackPlayer.CAPABILITY_STOP,
          TrackPlayer.CAPABILITY_SET_RATING,
          TrackPlayer.CAPABILITY_PLAY_FROM_ID
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE
        ]
      });
    }

    //initialize the player when component renders by adding data and start playing
    playOnInit = async () =>{
      await TrackPlayer.reset();                                       //reset the player when it initialize
      await this.setState({PlaylistData: []});                         //clear the playlist data state otherwise it cause error on re-render
      await this.connectApi();                                         //then get the data from server
      await TrackPlayer.add(this.state.PlaylistData[1]);               //then set data in state  array index 1 because we cannot use spread operator in rewrite the state 
      await TrackPlayer.play();                                        //play the songs
    }

    //connect the server and get data
    connectApi = async () => {
      try { 
          await fetch('http://192.168.1.7:3000/meditation/allsongs', {
            method: 'GET',
          })
          .then(res => res.json())
          .then( async data =>{
            //set the data in the state playlistdata array by append without overwrite 
            this.setState({PlaylistData:[this.state.PlaylistData,data]})    
          })
        } catch (error) {
         console.log('the catch error',error)
        } 
    }  

    //function to toggle play and pause in media player
    togglePlayback = async () => {
      const playbackState = await TrackPlayer.getState();
      if (playbackState === TrackPlayer.STATE_PAUSED) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }

    //function for next song change
    skipToNext = async() => {
      try {
        await TrackPlayer.skipToNext();
      } catch (_) {
        //called when the playlist ended 
        await this.setState({PlaylistData: []});                         //clear the playlist data state otherwise it cause error on re-render
        await this.connectApi();                                         //then get the data from server
        await TrackPlayer.add(this.state.PlaylistData[1]);  
      }
    }
    
    //function for move to previous song
    skipToPrevious = async () => {
      try {
        await TrackPlayer.skipToPrevious();
      } catch (_) {}
    }
  
    render() {
      return (
        <View style={Styles.container} >
            <Player
              onNext={this.skipToNext}
              style={Styles.player}
              onPrevious={this.skipToPrevious}
              onTogglePlayback={this.togglePlayback}
              timerValue={this.state}
            />
        </View>
      )
    }
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  player: {
    marginTop: 25
  },
});

export default MusicPlayerComponent;