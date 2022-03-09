import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet, ScrollView, FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (login, user_id, post_id) => {
  try {
    const jsonLogin = JSON.stringify(login);
    const jsonUser = JSON.stringify(user_id);
    const jsonPostID = JSON.stringify(post_id);
    await AsyncStorage.setItem('@spacebook_details', jsonLogin);
    await AsyncStorage.setItem('@other_user_id', jsonUser);
    await AsyncStorage.setItem('@post_id', jsonPostID);
  } catch (e) {
    console.error(e);
  }
};

const editStoreData = async (login, user_id, post) => {
  try {
    const jsonLogin = JSON.stringify(login);
    const jsonUser = JSON.stringify(user_id);
    const jsonPost = JSON.stringify(post);
    await AsyncStorage.setItem('@spacebook_details', jsonLogin);
    await AsyncStorage.setItem('@other_user_id', jsonUser);
    await AsyncStorage.setItem('@post', jsonPost);
  } catch (e) {
    console.error(e);
  }
};

const getData = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const data = JSON.parse(jsonValue);
    return done(data);
  } catch (e) {
    console.error(e);
  }
};

const getOtherUser = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@other_user_id');
    const data = JSON.parse(jsonValue);
    return done(data);
  } catch (e) {
    console.error(e);
  }
};

class FriendWallScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      feed: {},
      info: {},
      other_user_id: {},
      cur_post: {},
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: true,
        feed: {},
        info: {},
        cur_post: {},
      });

      getOtherUser((id) => {
        this.setState({
          other_user_id: id,
        });

        this.getProfile();
        this.getFeed();
      });
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: true,
        feed: {},
        info: {},
        cur_post: {},
      });

      getOtherUser((id) => {
        this.setState({
          other_user_id: id,
        });

        this.getProfile();
        this.getFeed();
      });
    });
  });

  getProfile = () => {
    console.log('Getting profile...');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: true,
          info: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getFeed = () => {
    console.log('Getting wall...');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/post`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          feed: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  addLike = (post_id) => {
    console.log('Adding Like...');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/post/${post_id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then(this.getFeed())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  removeLike = (post_id) => {
    console.log('Removing Like...');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/post/${post_id}/like`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then(this.getFeed())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  viewPost = () => {
    storeData(this.state.login_info, this.state.other_user_id, this.state.cur_post.post_id);
    this.props.navigation.navigate('View Friend Post');
  };

  editPost = () => {
    editStoreData(this.state.login_info, this.state.other_user_id, this.state.cur_post);
    this.props.navigation.navigate('Edit Friend Post');
  };

  deletePost = (post_id) => {
    console.log('Deleting post...');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/post/${post_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          feed: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View><Text>Loading...</Text></View>
      );
    }

    console.log('here', this.state);
    return (
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <Text style={styles.centerText}>
            {this.state.info.first_name}
            {' '}
            {this.state.info.last_name}
          </Text>

          <Button
            style={styles.buttonStyle}
            title="Add post to this wall"
            onPress={() => this.props.navigation.navigate('Friend Post')}
          />
          <View style={styles.flexContainer}>

            <FlatList
              data={this.state.feed}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text>
                    {item.author.first_name}
                    {' '}
                    {item.author.last_name}
                    :
                  </Text>
                  <Text>{item.text}</Text>
                  <Text>
                    Likes:
                    {' '}
                    {item.numLikes}
                  </Text>

                  <View style={styles.buttonContainer}>
                    <Button
                      style={styles.buttonStyle}
                      title="View"
                      onPress={() => {
                        this.setState({ cur_post: item }, () => {
                          this.viewPost();
                        });
                      }}
                    />

                    {item.author.user_id != this.state.login_info.id ? (
                      <Button

                        style={styles.buttonStyle}
                        title="Like"
                        onPress={() => {
                          this.addLike(item.post_id);
                          this.setState({ isLoading: true }, () => {
                            this.getFeed();
                          });
                        }}
                      />
                    ) : null}

                    {item.author.user_id != this.state.login_info.id ? (
                      <Button
                        style={styles.buttonStyle}
                        title="Unlike"
                        onPress={() => {
                          this.removeLike(item.post_id);
                          this.setState({ isLoading: true }, () => {
                            this.getFeed();
                          });
                        }}
                      />
                    ) : null}

                    {item.author.user_id == this.state.login_info.id ? (
                      <Button

                        style={styles.buttonStyle}
                        title="Edit"
                        onPress={() => {
                          this.setState({ cur_post: item, isLoading: true }, () => {
                            this.editPost();
                          });
                        }}
                      />
                    ) : null}

                    {item.author.user_id == this.state.login_info.id ? (
                      <Button

                        style={styles.buttonStyle}
                        title="Delete"
                        onPress={() => {
                          this.deletePost(item.post_id);
                          this.setState({ isLoading: true }, () => {
                            this.getFeed();
                          });
                        }}
                      />
                    ) : null}

                  </View>
                </View>
              )}
              keyExtractor={(item, index) => item.post_id}
            />
          </View>
        </View>
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  centerText: {
    alignSelf: 'center',

  },

  buttonStyle: {
    width: 50,
    height: 50,
    alignItems: 'center',

  },

  headerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },

  scrollView: {
    flex: 1,
    height: '100%',
    width: '100%',
    margin: 20,
    alignSelf: 'center',
  },
});

export default FriendWallScreen;
