import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PostScreen, GalleryHomeScreen, GalleryFullScreen, GalleryDownloadScreen, GalleryProfileScreen, GalleryProfileUpdateScreen } from '../Screens';

const Stack = createStackNavigator();

const GalleryNavigator_Stack = () => {
    return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Gallery_Home" >
                <Stack.Screen name = "Gallery_Home" component={ GalleryHomeScreen } options={() => ({ headerShown : false })}></Stack.Screen>
                <Stack.Screen name = "Gallery_Full" component={ GalleryFullScreen } options={() => ({ headerShown : false })}></Stack.Screen>
                <Stack.Screen name = "Gallery_Download" component={ GalleryDownloadScreen }  options={() => ({ headerShown : false})}></Stack.Screen>
                <Stack.Screen name = "Gallery_Profile" component={ GalleryProfileScreen }  options={() => ({ headerShown : false})}></Stack.Screen>
                <Stack.Screen name = "Gallery_Profile_Update" component={ GalleryProfileUpdateScreen }  options={() => ({ headerShown : false})}></Stack.Screen>
                <Stack.Screen name = "Gallery_Post" component={ PostScreen }  options={() => ({ headerShown : false})}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
    )
}

export default GalleryNavigator_Stack;