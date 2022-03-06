import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert, ScrollView, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (login, user_id, post_id) => {
    try {
      const jsonLogin = JSON.stringify(login)
      const jsonUser = JSON.stringify(user_id)
      const jsonPostID = JSON.stringify(post_id)
      await AsyncStorage.setItem('@spacebook_details', jsonLogin)
      await AsyncStorage.setItem('@other_user_id', jsonUser)
      await AsyncStorage.setItem('@post_id', jsonPostID)
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

const getOtherUser = async (done) => {
    try {
        const jsonValue = await AsyncStorage.getItem('@other_user_id')
        const data = JSON.parse(jsonValue);
        return done(data);
    } catch(e) {
        console.error(e);
    }
}


class FriendWallScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            login_info: {},
            isLoading: true,
            feed: {},
            other_user_id: {},
            cur_post: {}
        }
    }

    

    componentDidMount(){
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: true,
                feed: {},
                cur_post: {}
            });

            getOtherUser((id) => {
                this.setState({
                    other_user_id: id
                })

                this.getFeed();
            })

            
        });  
    }

    refresh = this.props.navigation.addListener('focus', () => {
        getData((data) => {
            this.setState({
                login_info: data,
                isLoading: true,
                feed: {}
            });

            getOtherUser((id) => {
                this.setState({
                    other_user_id: id
                })

                this.getFeed();
            })

            
        });  
    });
    

    getFeed = () => {
        console.log("Getting wall...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.other_user_id + '/post', {
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

      addLike = (post_id) => {
        console.log("Adding Like...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.other_user_id + '/post/' + post_id + '/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            }
        })
        .then((response) => response.json())
        .then(this.getFeed())
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

      removeLike = (post_id) => {
        console.log("Removing Like...");
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.other_user_id + '/post/' + post_id + '/like', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': this.state.login_info.token
            }
        })
        .then((response) => response.json())
        .then(this.getFeed())
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

      viewPost = () => {
        storeData(this.state.login_info, this.state.other_user_id, this.state.cur_post.post_id);
        this.props.navigation.navigate("View Friend Post");
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
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <FlatList
                            data={this.state.feed}
                            renderItem={({item}) => (
                                <View>
                                    <Text>{item.author.first_name} {item.author.last_name}:</Text>
                                    <Text>{item.text}</Text>
                                    <Text>Likes: {item.numLikes}</Text>

                                    <Button
                                    style = {styles.buttonStyle}
                                    title="View"
                                    onPress={() => {
                                        this.setState({cur_post: item}, () => {
                                            this.viewPost()
                                        })
                                        
                                    }}
                                    />

                                    {item.author.user_id != this.state.login_info.id ? <Button 
                                    
                                    style = {styles.buttonStyle}
                                    title="Like"
                                    onPress={() => {
                                        this.addLike(item.post_id)
                                        this.setState({isLoading: true}, () => {
                                            this.getFeed()
                                        })
                                        }
                                    }
                                    /> : null}

                                    {item.author.user_id != this.state.login_info.id ? <Button
                                    style = {styles.buttonStyle}
                                    title="Unlike"
                                    onPress={() => {
                                        this.removeLike(item.post_id)
                                        this.setState({isLoading: true}, () => {
                                            this.getFeed()
                                        })
                                        }
                                    }
                                    /> : null}
                                </View>
                            )}
                            keyExtractor={(item,index) => item.post_id}
                        />
                    </ScrollView>

                    <Button
                        style = {styles.buttonStyle}
                        title="Add post to this wall"
                        onPress={() => this.props.navigation.navigate("Friend Post")}
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
    },

    scrollView: {
        height: '100%',
        width: '100%',
        margin: 20,
        alignSelf: 'center',
    },
});

export default FriendWallScreen;