/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, AsyncStorage } from 'react-native';
import { Login, } from './Login';
import { LoginScreen,  ProfileScreen, MobileNoScreen, OTPScreen, MeditationHomeScreen, MeditationAudioScreen, PlaylistScreen, PostScreen,
        GalleryHomeScreen, GalleryProfileScreen, ProfileHomeScreen, GalleryProfileUpdateScreen,
        GratitudePostScreen, GratitudeHomeScreen, GratitudeDetailsScreen, 
        ChatHomeScreen, ChatListScreen, ChatRoomScreen } from './Screens';
import { SignUpNavigator, MeditationNavigator_Stack, GalleryNavigator_Stack, GratitudeNavigator_Stack, ChatNavigator_Stack } from './Navigators'
import { AuthProvider } from './Theme/AuthProvider';
import { Routes } from './Routes'

const App =() => {

  /*useEffect(()=> {
      AsyncStorage.setItem('email', 'anandha12@gmail.com');
      AsyncStorage.setItem('password', 'anandha12');
  })*/

  return (
    <SafeAreaView style= {{flex: 1}}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </SafeAreaView>
  )
};

export default App;


/*
<Text>hi da bad bad guy</Text>
//debug key for firebase app
3D:F1:0E:CB:8B:AD:02:DD:DE:C5:51:E0:B7:99:E0:02:38:5F:A6:1D
//debug sha1 key for firebase app
3D:F1:0E:CB:8B:AD:02:DD:DE:C5:51:E0:B7:99:E0:02:38:5F:A6:1D
*/