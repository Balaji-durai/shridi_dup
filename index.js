/**
 * @format
 */
import './logbox';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';

/*var firebaseConfig = {
    apiKey: "AIzaSyBgu0mkMfhEQzCt0WmrxdP0n1tPPe8rHBk",
    authDomain: "shridisaimaharaj-aba0f.firebaseapp.com",
    databaseURL: "https://shridisaimaharaj-aba0f.firebaseio.com",
    projectId: "shridisaimaharaj-aba0f",
    storageBucket: "shridisaimaharaj-aba0f.appspot.com",
    messagingSenderId: "910563901267",
    appId: "1:910563901267:android:a438c2b7a6507dd3a5eba6",
};

firebase.initializeApp(firebaseConfig);*/

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./service.tsx'));
