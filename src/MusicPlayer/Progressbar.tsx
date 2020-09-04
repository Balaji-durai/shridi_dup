import React, { useState, useEffect } from "react";
import { useTrackPlayerProgress } from "react-native-track-player";
import { View, StyleSheet } from "react-native";
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Constants, Colors } from "../Styles";

export default function ProgressBar(props) {
    const progress = useTrackPlayerProgress();
  /*  //const [pos,setPos]= useState(0)
    var pgrsTime= 0
    pgrsTime += progress;
    //setPos(pgrsTime)
    //console.log(pgrsTime,progress)
    var hour  = props.timerValue.Hour;
    var minute = props.timerValue.Minute;
    var seconds = props.timerValue.Seconds;
    var secsInHour= hour * 3600;
    var secsInMinute = minute * 60;
    var totalSecs = secsInHour + secsInMinute + seconds;
    var timeInStr= hour + ':' + minute + ':' + seconds
    progress.duration = totalSecs;
    //var countDownDate = new Date(timeInStr.toString()).getTime();
    //var time= Math.round(time)
   //console.log(countDownDate,timeInStr,typeof(countDownDate))

// Update the count down every 1 second
/*var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for hours, minutes and seconds
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var secs = Math.floor((distance % (1000 * 60)) / 1000);
  console.log(hours,minutes,secs)
}, 1000);*/

    
    return (
      <View style={Styles.progress}>
        <View style={{ flex: progress.position, backgroundColor: Colors.PrimaryColor_2 }} />
        <View
          style={{
            flex:  progress.duration - progress.position,
            backgroundColor: Colors.SecondaryColor_2,
            opacity: 0.3
          }}
        />
      </View>
    );
}

const Styles = StyleSheet.create({
    progress: {
        height: hp(0.443),
        width: wp('65.1%'),
        marginTop: 10,
        flexDirection: "row"
      },
})

