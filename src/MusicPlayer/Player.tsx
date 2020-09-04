import React, { useState, useEffect, Component } from "react";
import PropTypes from "prop-types";
import TrackPlayer, { useTrackPlayerEvents, TrackPlayerEvents, getCurrentTrack, getTrack } from "react-native-track-player";
import { Image, StyleSheet, Text, View, ViewPropTypes, Button } from "react-native";
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Constants, Colors } from "../Styles";
import ProgressBar from './Progressbar';
import ImageButton  from '../Components/ImageButton';

class Timer extends Component {
    constructor(props) {
    super(props);
    this.state = {
      remainingTime: 0,
      currentTime: 0
     };
     this.timer;
    }

    componentDidMount() {
      this.countdownTimer();
    }

    timer=setInterval(() => {
      var duration= this.state.remainingTime;
         // Hours, minutes and seconds
      var hrs = ~~(duration / 3600);
      var mins = ~~((duration % 3600) / 60);
      var secs = ~~duration % 60;
  
      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";
  
      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }
  
      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      this.setState({currentTime: ret})
    },1000)
    
  countdownTimer(){
   this.setState({remainingTime: 1 });
   clearInterval(timer);
    var timer = setInterval(() =>{
        if(!this.state.remainingTime){
          clearInterval(timer);
          return false;
        }
        
        this.setState(prevState =>{
        return {remainingTime: prevState.remainingTime + 1}});
        },1000);
  }

  render() {
      return (
       <View style={styles.container}>
         <Text style={styles.durationText}>{this.state.currentTime}</Text>
       </View>
      );
  }
}

export default function Player(props) {
  var hour = props.timerValue.Hour;
  var minute = props.timerValue.Minute;
  var seconds = props.timerValue.Seconds;
  const [Time,setTime] = useState('');

  //set the timer when component renders and clear when component unmount
  useEffect(() => {
    getDuration();
   // getCurrentState();
    //setInterval(setTimer, 1000);
    var countsTimer=setInterval(countTimer, 1000);
    return function cleanup(){
      clearInterval(countsTimer)
    }
  },[hour,minute,seconds])

  //function to convert state values to seconds
  const getDuration = () => {
    var secsInHour= hour * 3600;
    var secsInMinute = minute * 60;
    var totalSecs = secsInHour + secsInMinute + seconds;
    fancyTimeFormat(totalSecs);
  }

  //converts seconds to Output like "1:01" or "4:03:59" or "123:03:59"
  const fancyTimeFormat =(duration) => {   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;
    var ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    setTime(ret);
  }

  
  var totalSeconds = 0;
  var countUp = '';
  const countTimer= () => {
     ++totalSeconds;
     var hour,minute,seconds
     hour = Math.floor(totalSeconds /3600);
     minute = Math.floor((totalSeconds - hour*3600)/60);
     seconds = totalSeconds - (hour*3600 + minute*60);
     if(hour < 10)
       hour = "0"+hour;
     if(minute < 10)
       minute = "0"+minute;
     if(seconds < 10)
       seconds = "0"+seconds;
       countUp= hour + ":" + minute + ":" + seconds;
       //console.log('the timer value2:',countUp);
       return countUp
  } 
  
  const [currentState, setCurrentState] = useState(TrackPlayer.STATE_NONE);
  const [trackTitle, setTrackTitle] = useState("");
  const [trackArtwork, setTrackArtwork] = useState();
  const [trackArtist, setTrackArtist] = useState("");
  const playIcon = require('../../Images/play.png');
  const previousIcon = require('../../Images/previous.jpg');
  const nextIcon = require('../../Images/next.png');
  const resumeIcon = require('../../Images/resume.jpg');

 
  /* useTrackPlayerEvents(["playback-track-changed"], async () => {
    var cur_Track= await TrackPlayer.getCurrentTrack();
    const track = await TrackPlayer.getTrack(cur_Track);
    const { title, artist, artwork } = track || {};
     setTrackTitle(title);
     setTrackArtist(artist);
     setTrackArtwork(artwork);
  });  */

  //set the track details in state using event listener playback-track-changed
  useTrackPlayerEvents(["playback-track-changed"], async event => {
    if (event.type === TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const { title, artist, artwork } = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });  

  //get the play state using event listener and store in currentPlayState state
  useTrackPlayerEvents(['playback-state'],() => {
    var currentState =async () => {
        const currentPlayState = await TrackPlayer.getState();
        setCurrentState(currentPlayState);
    }
    currentState()
  }) 
 
  const { style, onNext, onPrevious, onTogglePlayback } = props;

  return (
    <View style={[styles.card, style]}>
      <View style={[styles.ImageConatiner,{ elevation: 10, shadowColor: '#d9d9d9', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 4,  borderRadius: hp(2.95)}]}>
      <Image style={styles.cover} source={ require('../../Images/saibaba_loginScreen.jpg')} />
      </View>
      <Text style={styles.title}>{trackTitle}</Text>
      <Text style={styles.artist}>{trackArtist}</Text>
      <ProgressBar timerValue={props.timerValue}/>
      <View style={{flexDirection: 'row',width: wp('65.1%') ,justifyContent: 'flex-start',alignItems: 'flex-start',marginTop: hp(0.75)}}>
        <View style={{alignSelf: 'flex-start'}}>
          <Timer/>
        </View>
        <View style={{alignSelf: 'flex-end',paddingLeft: wp('55.5%')}}>
          <Text style={[styles.durationText]}>{Time}</Text>
        </View>
      </View>
      <View style={styles.controls}>
                    <ImageButton
                        source={previousIcon}
                        onPress={onPrevious}
                        style={styles.changeIcon}
                        imageStyle={styles.controlChangeIcon}
                    />
                    <ImageButton
                        source={TrackPlayer.STATE_PLAYING === currentState ? resumeIcon : playIcon}
                        onPress={onTogglePlayback}
                        style={styles.playPause}
                        imageStyle={styles.controlIcon}
                    />
                    <ImageButton
                        source={nextIcon}
                        onPress={onNext}
                        style={[styles.changeIcon,/*{ elevation: 3,shadowOffset: { width: -0, height: -1 },backgroundColor: Colors.white}*/]}
                        imageStyle={styles.controlChangeIcon}
                    />
      </View>
      <Text></Text>
    </View>
  );
}

Player.propTypes = {
  style: ViewPropTypes.style,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onTogglePlayback: PropTypes.func.isRequired
};

Player.defaultProps = {
  style: {}
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
  },
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  ImageConatiner: {
    width: wp('54%'),
    height: hp(31.423),
    //marginTop: hp(1.77),
    paddingTop: hp(1),
    borderRadius: hp(2.211),
  },
  cover: {
    width: wp('55%'),
    height: hp(31.423),
    borderRadius: hp(2.211),
    flex : 1,
    resizeMode: 'cover',
  },
  progress: {
    height: hp(0.443),
    width: wp('65.1%'),
    marginTop: 10,
    flexDirection: "row"
  },
  title: {
    marginTop: hp(2.95),
    fontSize: hp(2.95),
    fontFamily: Constants.fontMedium,
    color: Colors.SecondaryColor_2,
    fontWeight: 'bold',
    lineHeight: hp(2.655),
  },
  artist: {
    fontSize: hp(1.77),
    marginTop: hp(1.20),
    fontFamily: Constants.fontRegular,
    color: Colors.SecondaryColor_2,
    lineHeight: hp(2.36),
  },
  controls: {
    marginVertical: hp(1.15),
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
  },
  controlButtonContainer: {
    flex: 1
  },
  controlButtonText: {
    fontSize: 18,
    textAlign: "center"
  },
  controlIcon: {
    width: 40,
    height: 40,
    //elevation: 3,
  },
  controlChangeIcon: {
    width: 30,
    height: 30,
    //elevation: 3,
  },
  playPause: {
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.white,
    padding: 10,
    marginHorizontal: 15
  },
  changeIcon: {
    borderRadius: 41,
    borderWidth: 2,
    borderColor: Colors.white,
    //elevation: 3,
    padding: 10,
    marginHorizontal: 15,
  },
  durationText: {
    fontFamily: Constants.fontRegular,
    fontSize: hp(1.44),
    lineHeight: hp(2.36),
    color: Colors.SecondaryColor_2
  }
});