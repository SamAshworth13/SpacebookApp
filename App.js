import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {View} from 'react-native';

import HomeScreen from './components/home';
import SignupScreen from './components/signup';
import LoginScreen from './components/login';
import EditProfileScreen from './components/editProfile';
import AddPostScreen from './components/addPost';

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
            <Stack.Screen name="Update Profile" component={EditProfileScreen} />
            <Stack.Screen name="New Post" component={AddPostScreen} />
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
  
}

export default App;