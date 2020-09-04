import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChatListScreen, ChatRoomScreen, ChatHomeScreen } from '../Screens';

const Stack = createStackNavigator();

const ChatNavigator_Stack = () => {
    return (
    <SafeAreaProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Chat_List" >
                <Stack.Screen name = "Chat_List" component={ ChatListScreen } options={() => ({ headerShown : false })}></Stack.Screen>
                <Stack.Screen name = "Chat_Room" component={ ChatRoomScreen } options={() => ({ headerShown : false })}></Stack.Screen>
                <Stack.Screen name = "Chat_Home" component={ ChatHomeScreen }  options={() => ({ headerShown : false})}></Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
    )
}

export default ChatNavigator_Stack;