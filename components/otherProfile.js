import React, { Component } from 'react';
import { Text, Image, TextInput, View, Button, StyleSheet, Alert, ScrollView } from 'react-native';
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

const getOtherUser = async (done) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@other_user_id')
        const data = JSON.parse(jsonValue);
        return done(data);
    } catch(e) {
        console.error(e);
    }
}



class ProfileScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            login_info: {},
            isLoading: true,
            info: {},
            photo: null
        }
    }

    componentDidMount(){
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: false,
                feed: {}
            });

            getOtherUser((id) => {
                this.setState({
                    other_user_id: id
                })

                this.getProfile();
                this.getProfilePic();
            })

            
            
        }); 
    }

    refresh = this.props.navigation.addListener('focus', () => {
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: false,
                feed: {}
            });

            getOtherUser((id) => {
                this.setState({
                    other_user_id: id
                })

                this.getProfile();
                this.getProfilePic();
            })
            
            
        });  
    });

    getProfilePic = () => {
        fetch('http://localhost:3333/api/1.0.0/user/'+ this.state.other_user_id +'/photo', {
          method: 'GET',
          headers: {
            'X-Authorization': this.state.login_info.token
          }
        })
        .then((res) => {
          return res.blob();
        })
        .then((resBlob) => {
          let data = URL.createObjectURL(resBlob);
          this.setState({
            photo: data,
            isLoading: false
          });
        })
        .catch((err) => {
          console.log("error", err)
        });
      }

    getProfile = () => {
        console.log("Getting profile...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.other_user_id, {
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
                
            
                <Image
                    source={{
                    uri: this.state.photo,
                    }}
                    style= {styles.imageStyle}
                />
                <Text>Name: {this.state.info.first_name} {this.state.info.last_name}</Text>
                <Text>Email address: {this.state.info.email}</Text>
                
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

    imageStyle: {
        width: 350,
        height: 350,
        borderWidth: 5,
        alignSelf: 'center'
    }
});

export default ProfileScreen;