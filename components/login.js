import React, { Component, useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@spacebook_details', jsonValue)
  } catch (e) {
      console.error(error);
  }
}


class LoginScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: "SA@mmu.ac.uk",
      password: "hello123"
    };
  }

  login = () => {
    fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: this.state.email,
            password: this.state.password
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        storeData(json);
        this.props.navigation.navigate("Feed");
    })
    .catch((error) => {
        console.error(error);
    });
}

  render() {

    const nav = this.props.navigation
    return (
        <View style={styles.flexContainer} >

            <TextInput 
            style = {styles.inputStyle}
            placeholder = "Enter email"
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            />
                
            <TextInput
            style = {styles.inputStyle}
            placeholder = "Enter password"
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            secureTextEntry={true}
            />
            <Button
            style = {styles.buttonStyle}
            title="Login"
            onPress={() => this.login()}
            />

            <Button
            style = {styles.buttonStyle}
            title="Signup"
            onPress={() => this.props.navigation.navigate("Signup")}
            />
        </View>
    );
  }

}


const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        flexDirection: 'column', 
        justifyContent: 'space-around', 
        alignItems: 'flex-start' 
    },

    buttonStyle: {
        width: 50,
        height: 50,
        alignItems: 'center'
        
    },

    inputStyle: {
        
    }
});

export default LoginScreen