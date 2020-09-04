import React, { Component } from 'react';
import { View, Image, StyleSheet, Text, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import { Constants, Colors } from '../Styles';
import { Login } from  '../Login'

export default class Loginscreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    onPress = () => { 
        console.log('buttton is clicked')
        //this.connect();
        //this.props.navigation.navigate("Profile");
    };

    connect =  async() => {
        console.log('you are in fetch api')
        try{ 
          await fetch('http://10.0.2.2:3000/login-signup/login/login', {
             method: 'POST',
             headers: {
               'Content-Type' : 'application/json',
             //  'enctype': 'multipart/form-data' 
             },
             body:  JSON.stringify({
                 email: this.state.email,
                 password: this.state.password,
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

    render() {
        return (
            <View style={Styles.container}>
                <StatusBar hidden= {true} />
                <View style = {Styles.ImageContainer}>
                    <Image source={require('../../Images/saibaba_loginScreen.jpg')}
                       style={Styles.HomeImage} />
                    <Image source={require("../../Images/symbol.png")}
                       resizeMode="contain"
                       style={Styles.LogoImage}
                    />
                </View>
                <View style={Styles.TextContainer}>
                    <Text style={Styles.TextStyle}>Shridi Sai Maharaj</Text>
                    <TextInput style={Styles.TextInput}
                               placeholder='Email'
                               autoFocus
                               onChangeText={text => this.setState({email:text}) }
                    />
                    <TextInput style={Styles.TextInput}
                               placeholder='Password'
                               secureTextEntry={true}
                               onChangeText={text => this.setState({password:text})}
                    />
                    <TouchableOpacity style={Styles.Button}
                                      onPress={this.onPress} 
                                      disabled= {((!this.state.email) && (!this.state.password))}>
                        <Text style={Styles.ButtonText}>Login</Text>
                    </TouchableOpacity>
                    <Text style={{marginTop: 20,opacity: 0.5,lineHeight: 18,fontSize: 15, fontFamily: Constants.fontRegular}}>or</Text>
                </View>
                <View style={Styles.SocialLoginContainer}>
                    <Login />
                </View>
            </View>
            )   
        }
}

const Styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    ImageContainer: {
        flex: 1.4,
    },
    HomeImage: {
        flex:1,
        resizeMode: "contain",
        transform: [{scale: 1.1}],
        height: undefined,
        width: undefined,
    },
    LogoImage: {
        top: 148,
        left: Constants.windowWidth/3.15,
        width: 135,
        height: 122,
        position: "absolute"
    },
    TextContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: "center",
        marginTop: 25,
    },
    TextStyle: {
        marginTop: 40,
        fontSize: 15,
        fontFamily: Constants.fontBold,
        lineHeight: 20,
        marginBottom: 20,
    },
    TextInput: {
        height: 45,
        width: Constants.buttonWidth, 
        borderColor: Colors.SecondaryColor_1, 
        fontFamily: Constants.fontRegular,
        borderWidth: 2,
        borderRadius: 10,
        paddingLeft: 15,
        marginBottom: 15,
        opacity: 0.5,
        alignItems: 'center',
    },
    Button: {
        backgroundColor: Colors.PrimaryColor_2,
        borderRadius: 10,
        height: 45,
        width: Constants.buttonWidth,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    ButtonText: {
        color: Colors.white, 
        fontSize: 15,
        fontFamily: Constants.fontRegular, 
    },
    SocialLoginContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: "center",
        marginBottom: 20,
    }
})

//export default LoginScreen;


/* const LoginScreen = () => {
    const [value, onChangeText] = useState('');
    const [Password, onChangeText_2] = useState('');
    const [count, setCount] = useState(0);
    const onPress = () => {setCount(prevCount => prevCount + 1) };


    return (
    <View style={Styles.container}>
        <StatusBar hidden= {true} />
        <View style = {Styles.ImageContainer}>
            <Image source={require('../../Images/saibaba_loginScreen.jpg')}
               style={Styles.HomeImage} />
            <Image source={require("../../Images/symbol.png")}
               resizeMode="contain"
               style={Styles.LogoImage}
            />
        </View>
        <View style={Styles.TextContainer}>
            <Text style={Styles.TextStyle}>Shridi Sai Maharaj</Text>
            <TextInput style={Styles.TextInput}
                       placeholder='Username'
                       autoFocus
                       onChangeText={text => onChangeText(text)}
                       value={value} />
            <TextInput style={Styles.TextInput}
                       placeholder='Password'
                       onChangeText={text => onChangeText_2(text)}
                       value={Password} />
            <TouchableOpacity style={Styles.Button}
                       onPress={onPress} >
            <Text style={Styles.ButtonText}>Login</Text></TouchableOpacity>
            <Text style={{marginTop: 20,opacity: 0.5}}>or</Text>
        </View>
        <View style={Styles.SocialLoginContainer}>
        <TouchableOpacity style={Styles.Button}
                       onPress={onPress} >
            <Text style={Styles.ButtonText}>Login with facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={Styles.Button}
                       onPress={onPress} >
            <Text style={Styles.ButtonText}>Login with google</Text>
        </TouchableOpacity>
        </View>
    </View>
    )
} */
