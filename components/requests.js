import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
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

class RequestsScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            login_info: {},
            isLoading: true,
            outstanding: [],
            other_user_id: {}
        }
    }

    componentDidMount(){
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: false,
                outstanding: []
            });
            this.getRequests();
        });  
    }
    

    refresh = this.props.navigation.addListener('focus', () => {
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: false,
                outstanding: []
            });

            this.getRequests();
        });  
    });

    getRequests = () => {
        console.log("Getting friend requests...");
        return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                isLoading: false,
                outstanding: responseJson
            })
        })
        .catch((error) => {
            console.log(error);
        });
      }

      acceptRequest = () => {
        console.log("Accepting friend request...");
        return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + this.state.other_user_id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                isLoading: false,
            })
        })
        .catch((error) => {
            console.log(error);
        });
      }

      deleteRequest = () => {
        console.log("Deleting friend request...");
        return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + this.state.other_user_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                isLoading: false,
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
                

                <FlatList
                    data={this.state.outstanding}
                    renderItem={({item}) => (
                        <View>
                            <Text>{item.first_name} {item.last_name}</Text>

                            <Button
                                style = {styles.buttonStyle}
                                title="Accept"
                                onPress={() => {
                                    this.setState({other_user_id: item.user_id}, () => {
                                        this.acceptRequest()
                                    });
                                }
                                }
                            />

                            <Button
                                style = {styles.buttonStyle}
                                title="Delete"
                                onPress={() => {
                                    this.setState({other_user_id: item.user_id}, () => {
                                        this.deleteRequest()
                                    });
                                }
                                }
                            />
                        </View>
                    )}
                    keyExtractor={(item,index) => item.user_id}
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

export default RequestsScreen;