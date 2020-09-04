import React, { useContext, useState, useEffect } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../Theme';
import { GalleryNavigator_Stack, GratitudeNavigator_Stack, ChatNavigator_Stack } from '../Navigators';
import { Loading } from '../Components';

const Routes = () => {
    //const [user, setUser] = useState('');
    const { user, setUser, login } = useContext(AuthContext);
    //const currentUser = user.toJSON();
    const [ loading, setLoading ] = useState(true);
    const [ initializing, setInitializing ] = useState(true);
  
    // Handle user state changes
    const onAuthStateChanged= async(user) => {
        setUser(user);
        console.log('the user on change:',user,'--',user.uid)
        await AsyncStorage.setItem('userFcm_id', user.uid);
        if (initializing) setInitializing(false);
        setLoading(false);
    }

    const AsyncStore = async() => {
        console.log('inside syncStore:',user)
        await AsyncStorage.setItem('email','rajivgandhi@gmail.com');
        await AsyncStorage.setItem('userId','5f1e9af143c44424b8e0da25');
        //await AsyncStorage.setItem('email','sanjaygandhi@gmail.com');
        await AsyncStorage.setItem('password', 'anandha12');
        const email= await AsyncStorage.getItem('email');
        const passWord= await AsyncStorage.getItem('password');
        const userId= await AsyncStorage.getItem('userFcm_id');
        console.log('the email in async storage:',email,'--',passWord,'---',userId)
        //await setUser(email);
        await login(email,passWord)
        //await setUser(user);
        console.log('inside syncStore after login',user,'---',userId)
        //await AsyncStorage.setItem('UserDetails', user);
    }

    const storeProfile = async() => {
        await AsyncStorage.setItem('profilePic', JSON.stringify("https://shridi-sai-maharaj.s3.amazonaws.com/Wed%20Jul%2029%202020%2015%3A02%3A54%20GMT%2B0530%20%28IST%29images%20%286%29.jpeg"));
        await AsyncStorage.setItem('userName', 'Anandha Krishnan');
    }

    useEffect(() => {
        //storeProfile();
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        //const email= AsyncStorage.getItem('email');
        AsyncStore();
        //console.log('the user details are:',user,'---',loading)
        return subscriber; // unsubscribe on unmount */
    }, []);

    return (
        <View style={{flex: 1}}>
            <GalleryNavigator_Stack />
        </View>
    );
  
    /*if (loading) {
        return (<Loading />);
    } else {
        return (
            <View style={{flex: 1}}>
                <ChatNavigator_Stack />
            </View>
        );
    }*/
}

export default Routes;

/*  
{loading ? (<GalleryNavigator_Stack />) : (<GratitudeNavigator_Stack />)}
*/