import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View} from 'react-native';

import FeedScreen from './components/feed';
import SignupScreen from './components/signup';
import LoginScreen from './components/login';

import ProfileScreen from './components/profile';
import RequestsScreen from './components/requests';
import SearchScreen from './components/search';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

class App extends Component {
  render(){
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Feed" component={FeedScreen} options={{
            headerLeft: null}} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
  
}

export default App;