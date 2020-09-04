import React, { Component } from 'react';
import { View, StyleSheet, Text, Alert, Image } from 'react-native';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import { Constants } from '../Styles';

export default class FBLoginButton extends Component {
  constructor() {
    super();
    //Setting the state for the data after login
    this.state = {
      user_name: '',
      email: '',
      token: '',
      profile_pic: '',
    };
  }

  get_Response_Info = (error, result) => {
    if (error) {
      //Alert for the Error
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      //response alert
      Alert.alert(JSON.stringify(result));
      this.setState({ user_name: result.name });
      this.setState({ email:  result.email });
      this.setState({ token:  result.id });
      this.setState({ profile_pic: result.picture.data.url });
    }
  };

  onLogout = () => {
    //Clear the state after logout
    console.log('the user details are:', this.state.user_name, this.state.token, this.state.email);
    this.setState({ user_name: null, token: null, profile_pic: null, email: null });
  };


  initUser(token) {
    fetch('https://graph.facebook.com/v2.9/me?fields=email,name,friends,picture.type(large)&access_token=' + token)
    .then((response) => response.json())
    .then((json) => {
      // Some user object has been set up somewhere, build that user here
     /* user.name = json.name
      user.id = json.id
      user.user_friends = json.friends
      user.email = json.email
      user.username = json.name
      user.loading = false
      user.loggedIn = true
      user.avatar = setAvatar(json.id)
      {this.state.profile_pic ? (
          <Image
            source={{ uri: this.state.profile_pic }}
            style={styles.imageStyle}
          />
        ) : null}
        <Text style={styles.text}> {this.state.user_name} </Text>
        <Text> {this.state.token} </Text>
        <Text> {this.state.email} </Text>
      */   
      this.setState({ user_name: json.name });
      this.setState({ email:  json.email });
      this.setState({ token:  json.id });
      this.setState({ profile_pic: json.picture.data.url });
    })
    this.connect();
  }

  connect =  async () => {
    /* const formData = new FormData();

     formData.append('Name', this.state.name);
     formData.append('Email', this.state.email);
     formData.append('Profile_Picture', this.state.profilePic);
     console.log('the datta may be',formData) */
    try{ 
      await fetch('http://10.0.2.2:3000/login-facebook/auth/facebook', {
         method: 'GET',
         headers: {
          // 'Content-Type': 'multipart/form-data',
           'Content-Type' : 'application/json',
          // 'enctype': 'multipart/form-data' 
         },
       /* body:  JSON.stringify( {
          Name: this.state.name
        } ) */
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
      <View style={styles.container}>
         {this.state.profile_pic ? (
          <Image
            source={{ uri: this.state.profile_pic }}
            style={styles.imageStyle}
          />
        ) : null}
        <Text style={styles.text}> {this.state.user_name} </Text>
        <Text> {this.state.token} </Text>
        <Text> {this.state.email} </Text>
        <LoginButton
          publishPermissions={['publish_actions']}
          readPermissions={['public_profile']}
          style={styles.FbButton}
          title="Login with Facebook"
          onLoginFinished={(error, result) => {
            if (error) {
              Alert.alert(error);
              Alert.alert('login has error: ' + result.error);
            } else if (result.isCancelled) {
                Alert.alert('login is cancelled.');
            } else {
              if (result) {console.log('login success')}
              AccessToken.getCurrentAccessToken().then(data => {
                Alert.alert(data.accessToken.toString());
                console.log('data:',data.accessToken.toString());
                const { accessToken } = data
                this.initUser(accessToken);

              /*  const processRequest = new GraphRequest(
                  '/me?fields=name,email,picture.type(large)',
                  null,
                  this.get_Response_Info
                );
                // Start the graph request.
                new GraphRequestManager().addRequest(processRequest).start(); */
              });
            }
          }}
          onLogoutFinished={this.onLogout}
        ></LoginButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    padding: 20,
  },
  imageStyle: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
  FbButton: {
    borderRadius: 10,
    height: 45,
    width: Constants.buttonWidth,
  }
});