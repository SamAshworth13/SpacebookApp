import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (login, post) => {
    try {
      const jsonLogin = JSON.stringify(login)
      const jsonPost = JSON.stringify(post)
      await AsyncStorage.setItem('@spacebook_details', jsonLogin)
      await AsyncStorage.setItem('@post', jsonPost)
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


class FeedScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            login_info: {},
            isLoading: true,
            to_be_edited: {},
            feed: {}
        }
    }

    

    componentDidMount(){
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: false,
                feed: {}
            });

            this.getFeed();
        });  
    }

    refresh = this.props.navigation.addListener('focus', () => {
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: false,
                feed: {}
            });

            this.getFeed();
        });  
    });
    

    getFeed = () => {
        console.log("Getting feed...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.login_info.id + '/post', {
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
                feed: responseJson
            })
        })
        .catch((error) => {
            console.log(error);
        });
      }
      

      deletePost = (post_id) => {
        console.log("Deleting post...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.login_info.id + '/post/' + post_id, {
            method: 'DELETE',
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
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    editPost = () => {
        storeData(this.state.login_info, this.state.to_be_edited);
        this.props.navigation.navigate("Edit Post");
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
                
                <FlatList
                    data={this.state.feed}
                    renderItem={({item}) => (
                        <View>
                            <Text>{item.author.first_name} {item.author.last_name}:</Text>
                            <Text>{item.text}</Text>
                            <Text>Likes: {item.numLikes}</Text>

                            {item.author.user_id == this.state.login_info.id ? <Button
                            style = {styles.buttonStyle}
                            title="Delete"
                            onPress={() => {
                                this.deletePost(item.post_id)
                                this.setState({feed: {}}, () => {
                                    this.getFeed()
                                })
                                }
                            }
                            /> : null}

                            {item.author.user_id == this.state.login_info.id ? <Button
                            style = {styles.buttonStyle}
                            title="Edit"
                            onPress={() => {
                                this.setState({to_be_edited: item}, () => {
                                    this.editPost()
                                })
                                
                            }}
                            /> : null}
                        </View>
                    )}
                    keyExtractor={(item,index) => item.post_id}
                />

                <Button
                    style = {styles.buttonStyle}
                    title="Add post to my wall"
                    onPress={() => this.props.navigation.navigate("New Post")}
                />
            </View>
                
            );

            

        }
    } 
}

const styles = StyleSheet.create({
    flexContainer: {
        flex: 9,
        flexDirection: 'column', 
        justifyContent: 'space-around', 
        alignItems: 'flex-start' 
    },

    buttonStyle: {
        width: 50,
        height: 50,
        alignItems: 'center'
        
    },

    headerStyle: {
        flex: 1,
        flexDirection: 'column', 
        justifyContent: 'space-around', 
        alignItems: 'flex-start' 
    }
});

export default FeedScreen;