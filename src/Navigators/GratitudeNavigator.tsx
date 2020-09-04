import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GratitudePostScreen, GratitudeHomeScreen, GratitudeDetailsScreen } from '../Screens';

const Stack = createStackNavigator();

const GratitudeNavigator_Stack = () => {
    return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Gratitude_Home" >
                <Stack.Screen name = "Gratitude_Post" component={ GratitudePostScreen } options={() => ({ headerShown : false })}></Stack.Screen>
                <Stack.Screen name = "Gratitude_Home" component={ GratitudeHomeScreen } options={() => ({ headerShown : false })}></Stack.Screen>
                <Stack.Screen name = "Gratitude_Details" component={ GratitudeDetailsScreen }  options={() => ({ headerShown : false})}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
    )
}

export default GratitudeNavigator_Stack;