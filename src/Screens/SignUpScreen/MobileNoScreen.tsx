import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Keyboard, TouchableOpacity, Platform, StatusBar,  KeyboardAvoidingView  } from 'react-native';
import { Constants, Colors } from '../../Styles';
//import { TextField } from '../../Components';
import { Icon } from 'react-native-elements';
import * as Progress from 'react-native-progress';

const MobileNoScreen = ({ route, navigation }) => {
    const [MobileNumber, onNumberText] = useState('');              //state to store mobileNo
    //get the datas by route in navigation
    const { Name } = route.params 
    const { DobBirth } = route.params
    const { Email } = route.params

    //function called when submit and navigate to otp screen
    const onPress = () => {
       // Keyboard.dismiss();
        console.log('the button is clicked, Mobile NO is:',MobileNumber)
        navigation.navigate("OTP",{Name: Name,DobBirth: DobBirth, Email: Email,MobileNumber: MobileNumber}); 
    };

    return (
        <KeyboardAvoidingView style={Styles.Container}  behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <StatusBar hidden= {true} />
            <View style={Styles.HeaderContainer}>
                <Text style={Styles.HeaderText}>Almost Done</Text>
            </View>
            <Progress.Bar progress={0.66} color={Colors.PrimaryColor_2} borderRadius={0} borderWidth={0} width={Constants.windowWidth}/>
            <View style={Styles.ContentContainer}>
                <Text style={Styles.ContentText}>Mobile Number</Text>
                <TextInput style={Styles.TextInput}
                           placeholder='Enter your mobile number'
                           placeholderTextColor= {Colors.SecondaryColor_2}
                           autoFocus
                           keyboardType= 'number-pad'
                           onChangeText={text => onNumberText(text)}
                           value={MobileNumber} />
            </View>
            <View style={Styles.ButtonContainer}>
                <TouchableOpacity style={Styles.Button}
                                  onPress={onPress}
                                  disabled={!MobileNumber} >
                    <Text style={Styles.ButtonText}>Continue</Text>
                    <Icon name='arrow-right-circle' type='feather' size= {20} color= {Colors.white} style={{marginLeft: 20, marginRight: 10}}/>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const Styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    HeaderContainer: {
        flex: 1.05,
        backgroundColor: Colors.PrimaryColor_1,
        justifyContent: 'flex-end',
    },
    HeaderText: {
        color: Colors.white,
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: Constants.fontMedium,
        marginLeft: Constants.headerPadding,
        marginBottom: 15
    },
    TextInput: {
        height: Constants.windowHeight/16.24,
        width: Constants.buttonWidth, 
        borderColor: Colors.SecondaryColor_1, 
        fontFamily: Constants.fontRegular,
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 15,
        marginTop: 20,
        opacity: 0.5,
        alignItems: 'center',
    },
    ContentContainer: {
        flex: 4,
        justifyContent: 'flex-start',
        marginTop: 15, 
        alignItems:"center", 
    },
    ContentText: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginTop: 15,
        marginLeft: Constants.headerPadding,
        opacity: 0.8
    },
    ButtonContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       marginBottom: 20,
    },
    Button: {
        backgroundColor: Colors.PrimaryColor_2,
        borderRadius: 10,
        height: 45,
        width: Constants.buttonWidth,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row'
    },
    ButtonText: {
        color: Colors.white, 
        fontSize: 15 ,
        fontFamily: Constants.fontRegular,
    },
})

export default MobileNoScreen;