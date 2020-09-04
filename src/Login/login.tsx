import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';
import { Button } from 'react-native-elements';
import { Constants } from '../Styles';

import  FBLoginButton  from './FBLogin';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userInfo: null,
          name: null,
          email: null,
          profilePic: null,
          gettingLoginStatus: true,
        };
      }
    
      componentDidMount() {
        //initial configuration
        GoogleSignin.configure({
          //It is mandatory to call this method before attempting to call signIn()
          // project name google api console: project-910563901267
          scopes: ['https://www.googleapis.com/auth/drive.readonly','https://www.googleapis.com/auth/user.phonenumbers.read'],
          // Repleace with your webClientId generated from Firebase console
          webClientId: '910563901267-66quoscgin2pb7akuvfu90ecg6df5mve.apps.googleusercontent.com',
          //androidClientId: '910563901267-vn2vdejnbic40mmftmpvo8r10mkjicdj.apps.googleusercontent.com',
          offlineAccess: true,
          forceCodeForRefreshToken: true
        });
        //Check if user is already signed in
        this._isSignedIn();
      }
    
      _isSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          Alert.alert('User is already signed in');
          //Get the User details as user is already signed in
          this._getCurrentUserInfo();
        } else {
          //alert("Please Login");
          console.log('Please Login');
        }
        this.setState({ gettingLoginStatus: false });
      };
    
      _getCurrentUserInfo = async () => {
        try {
          const userInfo = await GoogleSignin.signInSilently();
          console.log('User Info --> ', userInfo);
          this.setState({ userInfo: userInfo });
          this.setState({ name: userInfo.user.name });
          this.setState({ email: userInfo.user.email });
          this.setState({ profilePic: userInfo.user.photo });
        /*  const formData = new FormData();

          formData.append('userinfo', this.state.userInfo);

          fetch('http://loclhost:9000/logingoogle', {
            method: 'POST',
            body: formData
          })
          .then(response => response.json())
          .then(result => {
            console.log('Success:', result);
          })  */
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            Alert.alert('User has not signed in yet');
            console.log('User has not signed in yet');
          } else {
            Alert.alert("Something went wrong. Unable to get user's info");
            console.log("Something went wrong. Unable to get user's info");
          }
        }
      };

      LoginApi =  async () => {
       /* const formData = new FormData();

        formData.append('Name', this.state.name);
        formData.append('Email', this.state.email);
        formData.append('Profile_Picture', this.state.profilePic);
        console.log('the datta may be',formData) */
       try{ 
         await fetch('http://10.0.2.2:3000/login-google/google', {
            method: 'POST',
          /*  headers: {
             // 'Content-Type': 'multipart/form-data',
              'Content-Type' : 'application/json',
             // 'enctype': 'multipart/form-data' 
            }, */
           body:  JSON.stringify( {
             Name: this.state.name
           } ) 
          })
          .then(res => res.text())
          .then(data =>{
            console.log(data)
          })
         
        } catch (error) {
          console.log('the catch error',error)
        }
      }
    
      _signIn = async () => {
        //Prompts a modal to let the user sign in into your application.
        try {
          await GoogleSignin.hasPlayServices({
            //Check if device has Google Play Services installed.
            //Always resolves to true on iOS.
            showPlayServicesUpdateDialog: true,
          });
          const userInfo = await GoogleSignin.signIn();
          console.log('User Info --> ', userInfo);
          this.setState({ userInfo: userInfo });
          this.setState({ name: userInfo.user.name });
          this.setState({ email: userInfo.user.email });
          this.setState({ profilePic: userInfo.user.photo });
          this.LoginApi();
        } catch (error) {
          console.log('Message', error.message);
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('User Cancelled the Login Flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log('Signing In');
          } else if (error.code === statusCodes.SIGN_IN_REQUIRED) {
            console.log('Signing In Required');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play Services Not Available or Outdated');
          } else {
            console.log('Some Other Error Happened');
          }
        }
      };
    
      _signOut = async () => {
        //Remove user session from the device.
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          this.setState({ userInfo: null }); 
          this.LogoutApi();// Remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
      };

      LogoutApi =  async () => {
       
        try{ 
          await fetch('http://10.0.2.2:3000/login-google/logout', {
             method: 'GET',
           /*  headers: {
              // 'Content-Type': 'multipart/form-data',
               'Content-Type' : 'application/json',
              // 'enctype': 'multipart/form-data' 
             }, */
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
        //returning Loader untill we check for the already signed in user
        if (this.state.gettingLoginStatus) {
          return (
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          );
        } else {
          if (this.state.userInfo != null) {
            //Showing the User detail
            return (
              <View style={styles.container}>
                <Image
                  source={{ uri: this.state.userInfo.user.photo }}
                  style={styles.imageStyle}
                />
                <Text style={styles.text}>
                  Name: {this.state.userInfo.user.name}{' '}
                </Text>
                <Text style={styles.text}>
                  Email: {this.state.userInfo.user.email}
                </Text>
                <Button style={styles.button} onPress={this._signOut}>
                  <Text>Logout</Text>
                </Button>
              </View>
            );
          } else {
            //For login showing the Signin button
            return (
              <View style={styles.container}>
                <GoogleSigninButton
                  style={{  borderRadius: 10, height: 45, width: Constants.buttonWidth,marginBottom: 25}}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Light}
                  onPress={this._signIn}
                />
                <FBLoginButton />
              </View>
            );
          }
        }
      }
}
    

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    height: 100,
    marginTop: 30,
  },
  text: {
    color: '#000000'
  }
});

export default Login;