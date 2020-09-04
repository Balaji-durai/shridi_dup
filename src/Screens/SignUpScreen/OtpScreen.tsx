import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity, Platform, StatusBar, KeyboardAvoidingView } from 'react-native';
import { Constants, Colors } from '../../Styles';
import * as Progress from 'react-native-progress';

const OTPScreen = ({ route,navigation }) => {
    const [OTP, onNumberText] = useState([]);                      //array to store entered otp
    //get the datas by route in navigation
    const { Name } = route.params
    const { DobBirth } = route.params
    const { Email } = route.params
    const { MobileNumber } = route.params

    //function called when submit and navigate to otp screen
    const onPress = () => {
        console.log('the button is clicked,otp is:',OTP,Constants.windowWidth,Constants.windowHeight);
        connect(); 
        navigation.navigate("Login");
    };

    //finally sent the data to server
    var connect =  async() => {
        try{ 
            await fetch('http://10.0.2.2:3000/login-signup/login/', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    //  'enctype': 'multipart/form-data' 
                },
                body:  JSON.stringify({
                    name: Name,
                    birthday: DobBirth,
                    email: Email,
                    MobileNo: MobileNumber,
                    password: '123456',
                    passwordConf: '123456',
                }) 
            })
            .then(res => res.text())
            .then(data =>{
                console.log(data)
            })
          
        } catch (error) {
           console.log('the catch error',error)
        } 
    }

    return (
        <KeyboardAvoidingView style={Styles.Container}  behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <StatusBar hidden= {true} />
            <View style={Styles.HeaderContainer}>
                <Text style={Styles.HeaderText}>One step away</Text>
            </View>
            <Progress.Bar progress={1} color={Colors.PrimaryColor_2} borderRadius={0} borderWidth={0} width={Constants.windowWidth}/>
            <View style={Styles.ContentContainer}>
                <Text style={Styles.ContentText}>Enter your OTP</Text>
                <View style={Styles.TextInputContainer}>
                    <TextInput style={Styles.TextInput}
                           maxLength= {1}
                           keyboardType= 'number-pad'
                           placeholderTextColor= {Colors.SecondaryColor_2}
                           onChangeText={text => onNumberText(text)}
                    />
                    <TextInput style={Styles.TextInput}
                           maxLength= {1}
                           keyboardType= 'number-pad'
                           placeholderTextColor= {Colors.SecondaryColor_2}
                           onChangeText={text => onNumberText(text)}
                    />
                    <TextInput style={Styles.TextInput}
                           maxLength= {1}
                           keyboardType= 'number-pad'
                           placeholderTextColor= {Colors.SecondaryColor_2}
                           onChangeText={text => onNumberText(text)}
                    />
                    <TextInput style={Styles.TextInput}
                           maxLength= {1}
                           keyboardType= 'number-pad'
                           placeholderTextColor= {Colors.SecondaryColor_2}
                           onChangeText={text => onNumberText(text)}
                    />
                </View>
                    <Text style={Styles.InfoText}>Usually it takes 1-2 mins</Text>
                    <Text style={Styles.InfoText}>Please try again if you haven't received an OTP</Text>
            </View>
            <View style={Styles.ButtonContainer}>
                <TouchableOpacity style={Styles.Button}
                                  onPress={onPress} 
                                  disabled= {(!OTP)}>
                    <Text style={Styles.ButtonText}>Submit OTP</Text>
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
        lineHeight: 33,
        fontWeight: 'bold',
        fontFamily: Constants.fontMedium,
        marginLeft: Constants.headerPadding,
        marginTop: 20,
        marginBottom: 16
    },
    TextInput: {
        height: Constants.windowHeight/16.24,
        width: Constants.windowWidth/9.11, 
        borderColor: Colors.SecondaryColor_1, 
        fontFamily: Constants.fontRegular,
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 20,
        marginHorizontal: 8,
        marginVertical: 25,
        opacity: 0.5,
        alignItems: 'center',
    },
    ContentContainer: {
        flex: 4,
        justifyContent: 'flex-start',
        marginTop: 25, 
        alignItems:"center", 
    },
    ContentText: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        fontFamily: Constants.fontMedium,
        marginLeft: Constants.headerPadding,
    },
    TextInputContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    InfoContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    InfoText: {
        color: Colors.SecondaryColor_2,
        opacity: 0.5,
        fontFamily: Constants.fontRegular,
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

export default OTPScreen;