import React, { Component } from 'react';
import { View, StyleSheet, Text,PanResponder } from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MusicPlayerComponent } from '../../MusicPlayer';
import TrackPlayer from "react-native-track-player";

class MeditationAudioScreen extends Component {

    constructor(props) {
        super(props);
        //get the state values from home component via routing
        this.state = {
          Hour: this.props.route.params.Hour,
          Minute: this.props.route.params.Minute,
          Seconds: this.props.route.params.Seconds,
          Swipeflex: 0,
        }
    }

    componentDidMount() {
        this.getDuration();                                        //stops the player when timeOut 
    }


    //set the distance in vertical,limit for minimum swipe to recognize
    gestureConfig= ({ dy }) => {
        const draggedUp = dy < -40;
        return draggedUp
    }
   
    //swipe function to navigate playlist screen
    _panResponder = PanResponder.create({
        onMoveShouldSetPanResponder:(evt, gestureState) => this.gestureConfig(gestureState),
        onPanResponderMove: (evt, gestureState) => {
            const config= this.gestureConfig(gestureState)
            if(config) {
                const movement = gestureState.moveX/400;
                this.setState({Swipeflex: movement})
            }
        },
        onPanResponderRelease: () => {
            this.setState({Swipeflex: 0})
            this.props.navigation.navigate('Med_Playlist');
        }
    });

    //get  the milliseconds from state props
    getDuration = () => {
        var secsInHour= this.state.Hour * 3600;
        var secsInMinute = this.state.Minute * 60;
        var totalSecs = secsInHour + secsInMinute + this.state.Seconds;
        var milliSecs = totalSecs * 1000;
        this.invokeTimeout(milliSecs);
    }

    //stop the player when time is reached 
    invokeTimeout = (milliSeconds) => {
        setTimeout(this.stopPlayer,milliSeconds);
    } 

    //function to navigate and destroy player when timeOut
    stopPlayer = async() =>{
        console.log('timeout!!!!')
        await TrackPlayer.stop();
        await this.props.navigation.navigate('Med_Home')
    }

    //function to navigate meditation playlist screen
    Navigate_To_Playlist = () => {
        this.props.navigation.navigate('Med_Playlist');
    }

    //function to navigate meditation home screen and stop the player
    Navigate_To_Med_Home = async () => {
        await TrackPlayer.stop();
        await this.props.navigation.navigate('Med_Home');
    }

    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='arrowleft' type='antdesign'  size= {30} color= {Colors.white} onPress={this.Navigate_To_Med_Home}/>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), paddingRight: hp(13.275)}}>                    
                        <Text style={Styles.HeaderText}>Meditation</Text>
                        <Text style={Styles.SubHeaderText}>Your time to talk with baba </Text>
                    </View>
                    <View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
                        <Avatar size={60} rounded  source={require("../../../Images/saibaba_loginScreen.jpg")} />
                    </View>
                </View>
                <View style= {[Styles.ContentContainer,{ flex: 3.60 - this.state.Swipeflex}]}>
                    <MusicPlayerComponent value={this.state} />
                </View>
                <View style={[Styles.SwipeContainer,{ flex: 0.70 + this.state.Swipeflex, borderTopRightRadius: hp(3), borderTopLeftRadius: hp(3)}]} {...this._panResponder.panHandlers}>
                    <View style={{width: wp(30), backgroundColor: Colors.SecondaryColor_3, opacity: 0.2, height: hp(0.5)}}></View>
                    <Text style={{fontFamily: Constants.fontMedium, fontWeight:'bold',color: Colors.SecondaryColor_2, fontSize: hp(1.77), lineHeight: hp(2.655) }}>Swipe up for songs list</Text>
                    <Text style={{fontFamily: Constants.fontRegular, marginBottom: hp(1.77),color: Colors.SecondaryColor_2, fontSize: hp(1.44), lineHeight: hp(2.36) }}>Only on Sai Maharaj app</Text>
                </View>
            </View>
        )
    }
}

const Styles= StyleSheet.create({
    Container: {
        flex: 1,
    },
    HeaderContainer: {
        flex: 1.05,
        backgroundColor: Colors.PrimaryColor_1,
        paddingLeft: hp('2.95%'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    HeaderText: {
        fontFamily: Constants.fontProximaBold,
        fontWeight: 'bold',
        fontSize: hp('4.45%'),
        color: Colors.white,
        paddingBottom: 7,
    },
    SubHeaderText: {
        fontFamily: Constants.fontProximaReg,
        fontSize: hp('2%'),
        color: Colors.white,
        lineHeight: hp(2.211)
    },
    ContentContainer: {
        paddingHorizontal: hp('2.95%'),
        backgroundColor: Colors.white
    },
    SwipeContainer: {
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Colors.white,
        elevation: 50,
        borderTopColor: Colors.ShadowColor
    }
})

export default MeditationAudioScreen;

//<View style={{width: wp(100), borderTopRightRadius: 15, borderTopLeftRadius: 15, alignSelf: 'flex-start', marginTop: 0.1, backgroundColor:Colors.SecondaryColor_3, opacity: 0.7, height: hp(0.295)}}/>