import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { 
    NAVIGATION_TO_MOBILE_NO_SCREEN,
    NAVIGATION_TO_PROFILE_SCREEN,
    NAVIGATION_TO_OTP_SCREEN } from './RoutesConstants';
import { 
    LoginScreen, ProfileScreen, MobileNoScreen, OTPScreen } from '../Screens';

const Stack = createStackNavigator();

const SignUpNavigator = () => {
    return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Profle" >
                <Stack.Screen name = "Profile" component={ ProfileScreen } options={() => ({ headerShown : false })}></Stack.Screen>
                <Stack.Screen name = "MobileNo" component={ MobileNoScreen }  options={() => ({ headerShown : false})}></Stack.Screen>
                <Stack.Screen name = "OTP" component={ OTPScreen } options={() => ({ headerShown : false})}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
    )
}

export default SignUpNavigator;

//<Stack.Screen name = "login" component={ LoginScreen } options={() => ({ headerShown : false })}></Stack.Screen>