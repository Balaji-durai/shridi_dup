import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar, ListItem, Image } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TrackPlayer,{ TrackPlayerEvents } from "react-native-track-player";
import { number } from 'prop-types';
import ImageButton  from '../../Components/ImageButton';

export default class PlaylistScreen extends Component {

    constructor(props) {
        super(props) 
        this.state ={
            trackTitle: '',                              //data for miniPlayer title
            trackDuration: number,                       // data for miniplayer duration
            trackImage: '',                              // data for miniplayer avatar
            currentState: number,                        //current play state get from event listener
            PlaylistData: [],                            //playlist data for flatlist
        }

        //event function called when track is changed, it is used to change the miniplayer datas
        TrackPlayer.addEventListener('playback-track-changed', ()=> {
            var currentTrack = async () => {
                const currentTrack = await TrackPlayer.getCurrentTrack(); 
                var currentTrackObject = await TrackPlayer.getTrack(currentTrack);
                var Duration =this.fancyTimeFormat(currentTrackObject.duration)
                this.setState({trackDuration: Duration,})
                this.setState({trackTitle: currentTrackObject.title, trackImage: currentTrackObject.artwork})
            }
            currentTrack()
        })

        //event function to listen when playing state is changed and to store current state which is used for multiple purpose
        TrackPlayer.addEventListener('playback-state',() => {
            var currentState =async () => {
                var currentPlayState = await TrackPlayer.getState();
                this.setState({ currentState: currentPlayState})
            }
            currentState()
        })
    }

    //used to show time format like "1:01" or "4:03:59" or "123:03:59"
    fancyTimeFormat =(duration) =>{   
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
        return ret;
    }

    timeConvertFormat = (duration) => {
        var mins = ~~((duration % 3600) / 60);
        var secs = ~~duration % 60;
         // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";
        ret +=  (mins < 10 ? "0" : "");
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }

    componentDidMount() {
        this.setState({ PlaylistData: []})
        //get the current track details which is concurrently played in audio screen and set in state values
        var currentTrack = async () => {
            const currentTrack = await TrackPlayer.getCurrentTrack();
            var currentTrackObject = await TrackPlayer.getTrack(currentTrack);
            var Duration =this.fancyTimeFormat(currentTrackObject.duration)
            var currentPlayState = await TrackPlayer.getState();
            this.setState({ currentState: currentPlayState})
            this.setState({trackDuration: Duration})
            this.setState({trackTitle: currentTrackObject.title, trackImage: currentTrackObject.artwork})
        }
        currentTrack()
        this.connectApi()
    }

    //connect the server and get data for playlist
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
   
    //navigate function to Player screen
    Navigate_To_Med_Player = () => {
        this.props.navigation.navigate('Med_Player');
    }

    //function to change play and pause option by toggle
    async onTogglePlayback() {
        var states =await TrackPlayer.getState();
        if( states === TrackPlayer.STATE_PLAYING) {
            TrackPlayer.pause();
        } else {
            TrackPlayer.play();
        }
    }
    
    //render function to display songs in playlist
    renderItem( {item} ) {
        return (
            <ListItem 
                    leftAvatar={(<Avatar rounded size={'medium'} source={require("../../../Images/saibaba_loginScreen.jpg")} />)}
                    title={item.title}
                    titleStyle={{fontFamily: Constants.fontMedium, fontWeight: 'bold', fontSize: hp(2.211), lineHeight: hp(2.655)}}
                    subtitle={item.duration}
                    subtitleStyle={{fontFamily: Constants.fontRegular, fontSize: hp(1.77), lineHeight: hp(2.655)}}
                    bottomDivider= {true}
                    onPress={() =>{TrackPlayer.skip((item.id).toString()); TrackPlayer.play();}}
            />
        )
    }

    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='arrowleft' type='antdesign'  size= {30} color= {Colors.white} onPress={this.Navigate_To_Med_Player}/>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), paddingRight: hp(17.275)}}>                    
                        <Text style={Styles.HeaderText}>Sai Nama</Text>
                        <Text style={Styles.SubHeaderText}>Songs list</Text>
                    </View>
                    <View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
                        <Avatar size={60} rounded  source={require("../../../Images/saibaba_loginScreen.jpg")} />
                    </View>
                </View>
                <View style= {Styles.ContentContainer}>
                        <FlatList data={this.state.PlaylistData[1]}
                                  renderItem= {this.renderItem}
                                  keyExtractor={item => item.id} 
                                  //ItemSeparatorComponent={(<View style={{width: wp(100), backgroundColor:Colors.SecondaryColor_3, opacity: 0.7, height: hp(0.295)}}></View>)}
                        />
                </View>
                <View style={Styles.MiniPlayerContainer}>
                   <View style={Styles.MiniPlayer}>
                        <Avatar size='medium' avatarStyle={{borderRadius: hp(1)}} source={ this.state.trackImage && require("../../../Images/saibaba_loginScreen.jpg")} />
                        <View style={{width:wp('63%'), marginLeft: hp('1.44'), flexDirection: 'column', justifyContent: 'space-around',alignItems: 'flex-start'}}>
                            <Text style={{fontFamily: Constants.fontMedium, fontWeight: 'bold', fontSize: hp(2.211), lineHeight: hp(2.655)}}>{this.state.trackTitle}</Text>
                            <Text style={{fontFamily: Constants.fontRegular, fontSize: hp(1.77), lineHeight: hp(2.655)}}>{this.state.trackDuration}</Text>
                        </View>
                        <ImageButton
                            source={TrackPlayer.STATE_PLAYING === this.state.currentState ? require('../../../Images/resume.jpg') : require('../../../Images/play.png')}
                            onPress={this.onTogglePlayback}
                            style={Styles.playPause}
                            imageStyle={Styles.controlIcon}
                        />
                    </View>
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
        flex: 3.60,
    },
    MiniPlayerContainer: {
        flex:0.60,
        backgroundColor: Colors.white,
        elevation: 30,
        borderTopLeftRadius: hp(3),
        borderTopRightRadius: hp(3)
    },
    MiniPlayer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginVertical: hp(2.211),
        marginHorizontal: hp('2.95')
    },
    controlIcon: {
        width: 25,
        height: 25
    },
    playPause: {
        borderRadius: 30,
        borderWidth: 2,
        borderColor: Colors.white,
        padding: 10,
    },
})


 /*   <Icon raised name='heart-outlined' type='entypo' size= {20} color= {Colors.PrimaryColor_2} style={{paddingRight: hp(2.211)}} />
     rightElement={(<View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon name='dots-three-vertical' type='entypo' size= {20} color= {Colors.PrimaryColor_2} />
                                    </View>)} 
    */