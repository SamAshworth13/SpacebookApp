import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';

import HomeScreen from './components/home';
import SignupScreen from './components/signup';
import LoginScreen from './components/login';

const Stack = createNativeStackNavigator();

class App extends Component {
  render(){
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} options={{
            headerShown: false}} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
  
}

export default App;