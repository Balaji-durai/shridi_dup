import { WheelPicker } from "react-native-wheel-picker-android";
import React, { Component } from 'react';
import { View, StyleSheet, Text,  Platform, ImageBackground} from 'react-native';
import { Constants, Colors } from '../../Styles';
import { Icon, Avatar, Button } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//datas to show in wheelPicker
const PickerData_1= ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60']
const PickerData_2= ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']

export default class MeditationHomeScreen extends Component {
    state = {
        hour: 0,
        minute: 10,
        seconds: 0
    };
     
    // to fix state hours from timer
    onSelectedHour = hour => {
        this.setState({ hour });
    };

    // to fix state minute from timer
    onSelectedMinute = minute => {
        this.setState({ minute });
    };

    // to fix state seconds from timer
    onSelectedSeconds = seconds => {
        this.setState({ seconds });
    };

    // navigate to player screen
    Navigate_To_Med_Player = () => {
        this.props.navigation.navigate("Med_Player",{Hour: this.state.hour, Minute: this.state.minute, Seconds: this.state.seconds});
    }

    render () {
        return (
            <View style= {Styles.Container}>
                <View style= {Styles.HeaderContainer}>
                    <Icon name='menu' type='entypo'  size= {30} color= {Colors.white} />
                    <View style={{flexDirection: 'column', justifyContent: 'space-between', paddingTop: hp(2.211), paddingLeft: hp(2.95), paddingRight: hp(13.275)}}>                    
                        <Text style={Styles.HeaderText}>Meditation</Text>
                        <Text style={Styles.SubHeaderText}>Your time to talk with baba </Text>
                    </View>
                    <View style={{ paddingRight: hp(2.95), paddingTop: hp(3.685)}}>
                        <Avatar size={60} rounded  source={require("../../../Images/saibaba_loginScreen.jpg")} />
                    </View>
                </View>
                <View style= {Styles.ContentContainer}>
                    <Text style={Styles.ContentHeading}>Set duration</Text>
                    <View style={Styles.ContentTextContainer}>
                        <Text style={Styles.ContentText}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 
                            1500s, when an unknown printer took a galley 
                            of type and scrambled it to make a type specimen book. It has survived not only five centuries
                        </Text>
                    </View>
                    <View style={Styles.TimerContainer}>
                        <ImageBackground style={Styles.TimerImage} source={require("../../../Images/saibaba_meditations.png")}>
                            <View style={Styles.TimerTextContainer}>
                                <Text style={Styles.TimerText}>Hours</Text>
                                <Text style={Styles.TimerText}>Minutes</Text>
                                <Text style={Styles.TimerText}>Seconds</Text>
                            </View>
                            <View style={Styles.PickerContainer}>
                            <WheelPicker
                                selectedItem={this.state.hour}
                                data={PickerData_2}
                                itemTextSize={hp(3.2)}
                                itemTextColor={Colors.white}
                                itemTextFontFamily={Constants.fontRegular}
                                selectedItemTextColor={Colors.white}
                                selectedItemTextSize= {hp(4.4)}
                                selectedItemTextFontFamily= {Constants.fontRegular}
                                hideIndicator={true}
                                isCyclic={true}
                                onItemSelected={this.onSelectedHour}
                            />
                            <WheelPicker
                                selectedItem={this.state.minute}
                                data={PickerData_1}
                                itemTextSize={hp(3.2)}
                                itemTextColor={Colors.white}
                                itemTextFontFamily={Constants.fontRegular}
                                selectedItemTextColor={Colors.white}
                                selectedItemTextSize= {hp(4.4)}
                                selectedItemTextFontFamily= {Constants.fontRegular}
                                hideIndicator={false}
                                isCyclic={true}
                                onItemSelected={this.onSelectedMinute}
                            />
                            <WheelPicker
                                selectedItem={this.state.seconds}
                                data={PickerData_1}
                                itemTextSize={hp(3.2)}
                                itemTextColor={Colors.white}
                                itemTextFontFamily={Constants.fontRegular}
                                selectedItemTextColor={Colors.white}
                                selectedItemTextSize= {hp(4.4)}
                                selectedItemTextFontFamily= {Constants.fontRegular}
                                hideIndicator={false}
                                isCyclic={true}
                                onItemSelected={this.onSelectedSeconds}
                            />
                            </View>
                        </ImageBackground>
                    </View>
                    <Button 
                        title="Start session" 
                        titleStyle={{fontFamily: Constants.fontRegular,color: Colors.white, lineHeight: hp(2.95), fontSize: hp(2.211)}}
                        containerStyle={{paddingVertical: hp(2.95)}}
                        onPress={this.Navigate_To_Med_Player}
                        //disabled={(this.state.hour==0) || (this.state.minute==0) || (this.state.seconds==0)}
                        buttonStyle={{backgroundColor: Colors.PrimaryColor_2, borderRadius: hp(1.475),height: hp(6.637) }} 
                    />
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
        flex: 4,
        paddingHorizontal: hp('2.95%'),
    },
    ContentHeading: {
        fontFamily: Constants.fontMedium,
        color: Colors.SecondaryColor_2,
        fontSize: hp(2.655),
        lineHeight: hp(3.54),
        paddingVertical: hp(2.95)
    },
    ContentTextContainer: {
        flex: 1,
    },
    ContentText: {
        fontFamily: Constants.fontRegular,
        color: Colors.SecondaryColor_2,
        opacity: 0.5,
        fontSize: hp(2.211),
        lineHeight: hp(2.95)
    },
    TimerContainer: {
        flex: 1.64,
        backgroundColor: Colors.PrimaryColor_1,
        borderRadius: hp(1.475),
    },
    TimerImage: {
        resizeMode: 'contain',
        flex: 1,
        borderRadius: hp(1.475),
        overflow: 'hidden',
        overlayColor: Colors.white,
    },
    TimerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingVertical: hp(2.95),
        paddingBottom: hp(6)
    },
    TimerText: {
        fontFamily: Constants.fontRegular,
        color: Colors.white,
        fontSize: hp(2.211),
        lineHeight: hp(2.95),
        opacity: 1,
    },
    PickerContainer: {
        flex: 0.8,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
})

/*
 state= {
        hour: number,
    }
<Picker
style={{backgroundColor: 'none', width: 70, height: 150 }}
textStyle= {Colors.white}
selectedValue='1'
pickerData={[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59]}
onValueChange={value => {this.setState({hour: value}) }}
itemSpace={30} // this only support in android
/>

 <WheelPicker
                                selectedItem={this.state.seconds}
                                data={PickerData_1}
                                itemTextSize={hp(4.873)}
                                itemTextColor={Colors.white}
                                itemTextFontFamily={Constants.fontRegular}
                                selectedItemTextColor={Colors.white}
                                selectedItemTextSize= {hp(7.813)}
                                hideIndicator={false}
                                onItemSelected={this.onSelectedSeconds}
                            />
*/