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


class FeedScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            login_info: {},
            isLoading: true
        }
    }

    

    componentDidMount(){
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: false
            });
        });  
    }
    
    logout = () => {
        fetch('http://localhost:3333/api/1.0.0/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            }
            
        })
        .then((json) => {
            console.log(json);
            this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.error(error);
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
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>My Feed</Text>
                    
                    <Text>Login id: {this.state.login_info.id}</Text>
                    <Text>Login token: {this.state.login_info.token}</Text>
                    
                    <Button
                    style = {styles.buttonStyle}
                    title="Log Out"
                    onPress={() => this.logout()}
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

export default FeedScreen;