import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getData = async (done) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@spacebook_details')
        const data = JSON.parse(jsonValue);
        return done(data);
    } catch(e) {
        console.error(e);
    }
}

class EditProfileScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            login_info: {},
            isLoading: true,
            info: {},
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    componentDidMount(){
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: false,
                info: {}
            });

            this.getProfile();
        });  
    }

    getProfile = () => {
        console.log("Getting profile...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.login_info.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            }
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                isLoading: false,
                info: responseJson
            })
            this.setState({
                first_name: this.state.info.first_name,
                last_name: this.state.info.last_name,
                email: this.state.info.email,
            })
        })
        .catch((error) => {
            console.log(error);
        });
      }

      update = () => {
        console.log("Updating profile...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.login_info.id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            },
            body: JSON.stringify({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password
              })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                isLoading: false,
                info: responseJson
            })
        })
        .catch((error) => {
            console.log(error);
        });
      }

    render(){
        if(this.state.isLoading){
            return (
                <View><Text>Loading...</Text></View>
            )
        }
        else{

            console.log("here", this.state);
            return (
            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                
            
                
                <TextInput 
                style = {styles.inputStyle}
                placeholder = {this.state.info.first_name}
                onChangeText={(first_name) => this.setState({first_name})}
                //value={this.state.first_name}
                defaultValue = {this.state.info.first_name}
                />

                <TextInput 
                style = {styles.inputStyle}
                placeholder = {this.state.info.last_name}
                onChangeText={(last_name) => this.setState({last_name})}
                //value={this.state.last_name}
                defaultValue = {this.state.info.last_name}
                />

                <TextInput 
                style = {styles.inputStyle}
                placeholder = {this.state.info.email}
                onChangeText={(email) => this.setState({email})}
                //value={this.state.email}
                defaultValue = {this.state.info.email}
                />
                    
                <TextInput
                style = {styles.inputStyle}
                placeholder = "Enter new password"
                onChangeText={(password) => this.setState({password})}
                //value={this.state.password}
                secureTextEntry={true}
                />

                <Button
                style = {styles.buttonStyle}
                title="Update"
                onPress={() => this.update()}
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
        
    }
});

export default EditProfileScreen;