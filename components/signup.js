import React, { Component, useState } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView } from 'react-native';

class SignupScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          bad_details: false
        };
      }

      componentDidMount(){
        this.setState({bad_details: false});
      }
    
      refresh = this.props.navigation.addListener('focus', () => {
        this.setState({bad_details: false});
      });


      signup = () => {
        fetch('http://localhost:3333/api/1.0.0/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password
            })
        })
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.error(error);
            this.setState({bad_details: true});
        });
    }

    render(){
        if (!this.state.bad_details) {
            return (
                <View style={styles.flexContainer}>

                <TextInput 
                style = {styles.inputStyle}
                placeholder = "Enter first name"
                onChangeText={(first_name) => this.setState({first_name})}
                value={this.state.first_name}
                />

                <TextInput 
                style = {styles.inputStyle}
                placeholder = "Enter last name"
                onChangeText={(last_name) => this.setState({last_name})}
                value={this.state.last_name}
                />

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
                title="Sign Up"
                onPress={() => this.signup()}
                />
                </View>
            );
        }
        else {
            return (
                <View style={styles.flexContainer}>

                <TextInput 
                style = {styles.inputStyle}
                placeholder = "Enter first name"
                onChangeText={(first_name) => this.setState({first_name})}
                value={this.state.first_name}
                />

                <TextInput 
                style = {styles.inputStyle}
                placeholder = "Enter last name"
                onChangeText={(last_name) => this.setState({last_name})}
                value={this.state.last_name}
                />

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

                <Text>The details enetered are not valid</Text>

                <Button
                style = {styles.buttonStyle}
                title="Sign Up"
                onPress={() => this.signup()}
                />

                </View>
            );
        }
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
        width: '50%'
    }
});

export default SignupScreen;