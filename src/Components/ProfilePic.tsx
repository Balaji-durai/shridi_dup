import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import { Colors } from '../Styles';
import { Avatar } from 'react-native-elements';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class ProfilePic extends Component {
    constructor(props) {
        super(props) 
        this.state ={
            profilePic: ''
        }
    }
        
    componentDidMount= async() => {
        const profilePic= await AsyncStorage.getItem('profilePic');
        const parsedData= JSON.parse(profilePic);
        this.setState({profilePic: parsedData})
    }

    render () {
        return (
            <View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
            {this.state.profilePic.length>0 ?
                (<Avatar size={60} rounded source={{uri: this.state.profilePic}} />) :
                (<Avatar size={60} rounded overlayContainerStyle={{backgroundColor: Colors.SecondaryColor_3, borderRadius: hp('100%')}} icon={{ name: 'user', type: 'entypo', color: Colors.white, size: 41}} />)
            }
            </View>
        );
    }
}


/*
<View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
                        <Avatar size={60} rounded  source={require("../../../Images/saibaba_loginScreen.jpg")} />
                    </View>
*/