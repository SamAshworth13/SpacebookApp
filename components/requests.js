import React, { Component } from 'react';
import { View, Text } from 'react-native';

class RequestsScreen extends Component {
    render(){
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Requests</Text>
            </View>
        );
    } 
}

export default RequestsScreen;