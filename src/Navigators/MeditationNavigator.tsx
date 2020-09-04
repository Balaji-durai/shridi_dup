import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MeditationHomeScreen, MeditationAudioScreen, PlaylistScreen } from '../Screens';

const Stack = createStackNavigator();

const MeditationNavigator_Stack = () => {
    return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Med_Home" >
                <Stack.Screen name = "Med_Home" component={ MeditationHomeScreen } options={() => ({ headerShown : false })}></Stack.Screen>
                <Stack.Screen name = "Med_Player" component={ MeditationAudioScreen } options={() => ({ headerShown : false })}></Stack.Screen>
                <Stack.Screen name = "Med_Playlist" component={ PlaylistScreen }  options={() => ({ headerShown : false})}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
    )
}

export default MeditationNavigator_Stack;