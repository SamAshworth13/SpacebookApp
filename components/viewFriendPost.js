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

const getPostID = async (done) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@post_id')
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

class ViewFriendPostScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            login_info: {},
            isLoading: true,
            post: {},
            new_text: "",
            post_id: {},
            other_user_id: {}
        }
    }

    componentDidMount(){
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: true,
                post: {},
                new_text: "",
                post_id: {},
                other_user_id: {}
            });

            getPostID((id) => {
                this.setState({
                    post_id: id
                })

                getOtherUser((user_id) => {
                    this.setState({
                        other_user_id: user_id
                    })

                    this.getPost();
                })
            })

            
        });  
    }

    refresh = this.props.navigation.addListener('focus', () => {
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: true,
                post: {},
                new_text: "",
                post_id: {},
                other_user_id: {}
            });

            getPostID((id) => {
                this.setState({
                    post_id: id
                })

                getOtherUser((user_id) => {
                    this.setState({
                        other_user_id: user_id
                    })

                    this.getPost();
                })
            })

            
        });  
    });

    getPost = () => {
        console.log("Getting post...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.other_user_id + '/post/' + this.state.post_id, {
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
                post: responseJson
            })
        })
        .catch((error) => {
            console.log(error);
        });
      }

      addLike = () => {
        console.log("Adding Like...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.other_user_id + '/post/' + this.state.post_id + '/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            }
        })
        .then((response) => response.json())
        .then(this.getPost())
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

      removeLike = () => {
        console.log("Removing Like...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.other_user_id + '/post/' + this.state.post_id + '/like', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            }
        })
        .then((response) => response.json())
        .then(this.getPost())
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
                
            
                <Text>{this.state.post.author.first_name} {this.state.post.author.last_name}</Text>
                <Text>{this.state.post.text}</Text>
                <Text>Likes: {this.state.post.numLikes}</Text>

                {this.state.post.author.user_id != this.state.login_info.id ? <Button 
                            
                            style = {styles.buttonStyle}
                            title="Like"
                            onPress={() => {
                                this.addLike()
                                this.setState({isLoading: true}, () => {
                                    this.getPost()
                                })
                                }
                            }
                            /> : null}

                            {this.state.post.author.user_id != this.state.login_info.id ? <Button
                            style = {styles.buttonStyle}
                            title="Unlike"
                            onPress={() => {
                                this.removeLike()
                                this.setState({isLoading: true}, () => {
                                    this.getPost()
                                })
                                }
                            }
                            /> : null}

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

export default ViewFriendPostScreen;