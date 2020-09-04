import React, { Component } from 'react';
import { View, AsyncStorage, Text, StyleSheet } from 'react-native';
import { Colors, Constants } from '../Styles';
import { Avatar, Icon } from 'react-native-elements';
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
            <View>
                <Icon name='arrowleft' type='antdesign' size= {30} onPress={this.NAVIGATE_TO_GRATITUDE_HOME} color= {Colors.white}/>
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), width: wp('65%')}}>                    
                        <Text style={Styles.HeaderText}>Gratitude</Text>
                        <Text style={Styles.SubHeaderText}>Share our moments with baba</Text>
                    </View>
                    <ProfilePic />
            </View>
        );
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
        flex: 4.30,
        paddingVertical: hp(2.95),
        paddingHorizontal: hp(2.95),
        backgroundColor: Colors.white,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
})
/*
<View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
                        <Avatar size={60} rounded  source={require("../../../Images/saibaba_loginScreen.jpg")} />
                    </View>
*/