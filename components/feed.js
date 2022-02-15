import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
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

    render(){

        const nav = this.props.navigation

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

                    

                    
                </View>
            );

            

        }
    } 
}

export default FeedScreen;