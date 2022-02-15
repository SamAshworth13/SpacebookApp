import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FeedScreen from './components/home';
import SignupScreen from './components/about';
import LoginScreen from './components/login';

const Stack = createNativeStackNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Feed" component={FeedScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  
}

export default App;