import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (login, id) => {
    try {
      const jsonLogin = JSON.stringify(login)
      const jsonID = JSON.stringify(id)
      await AsyncStorage.setItem('@spacebook_details', jsonLogin)
      await AsyncStorage.setItem('@other_user_id', jsonID)
    } catch (e) {
        console.error(e);
    }
  }

const getData = async (done) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@spacebook_details')
        const data = JSON.parse(jsonValue);
        return done(data);
    } catch(e) {
        console.error(e);
    }
}

class FriendsScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            login_info: {},
            isLoading: true,
            search_text: '',
            results: [],
            other_user_id: {}
        }
    }

    componentDidMount(){
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: false
            });
            this.search();
        });  
    }
    

      search = () => {
        console.log("Searching...");
        return fetch('http://localhost:3333/api/1.0.0/search?q=' + this.state.search_text + '&search_in=friends', {
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
                results: responseJson
            })
        })
        .catch((error) => {
            console.log(error);
        });
      }

      viewProfile = () => {
        storeData(this.state.login_info, this.state.other_user_id);
        this.props.navigation.navigate("Friend's Wall");
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
                placeholder = 'Search...'
                onChangeText={(search_text) => {
                    this.setState({search_text}, () => {
                        this.search()
                      });
                    
                }
                }
                value= {this.state.search_text}
                />

                <FlatList
                    data={this.state.results.filter((item)=>item.user_id !== this.state.login_info.id)}
                    renderItem={({item}) => (
                        <View>
                            <Text>{item.user_givenname} {item.user_familyname}</Text>

                            <Button
                                style = {styles.buttonStyle}
                                title="View Profile"
                                onPress={() => {
                                    this.setState({other_user_id: item.user_id}, () => {
                                        this.viewProfile()
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

export default FriendsScreen;