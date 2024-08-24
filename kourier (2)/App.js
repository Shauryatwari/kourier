import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Button } from 'react-native';
import Send from './send';
import Receive from './receive';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Send File" onPress={() => navigation.navigate('Send')} />
            <Button title="Receive File" onPress={() => navigation.navigate('Receive')} />
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Send" component={Send} />
                <Stack.Screen name="Receive" component={Receive} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
