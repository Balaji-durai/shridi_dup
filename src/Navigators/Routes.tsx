import React, { useContext, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { AuthContext } from '../Theme';
import GalleryNavigator_Stack from './GalleryNavigator';
import GratitudeNavigator_Stack from './GratitudeNavigator';
import { Loading } from '../Components';

const Routes = () => {
    const [user, setUser] = useState('anandh');
    //const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);
  
    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
        setLoading(false);
    }
  
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        
        console.log('the user details are:',user,'---',loading)
        return subscriber; // unsubscribe on unmount
    }, []);
  
    /*if (loading) {
        return (<Loading />);
    }*/
    return (
        <View>
            {loading ? (<GalleryNavigator_Stack />) : (<GratitudeNavigator_Stack />)}
        </View>
    );
    
}

export default Routes

/*
{loading ? (<GratitudeNavigator_Stack />) : (<Text>Hi daw drling daw</Text>)}
{loading ? (<GalleryNavigator_Stack />) : (<GratitudeNavigator_Stack />)}
{user ? <GalleryNavigator_Stack /> : <GratitudeNavigator_Stack />}
*/
