import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

class FriendPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      post_text: '',
      other_user_id: {},
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
        post_text: '',
      });

      getOtherUser((id) => {
        this.setState({
          other_user_id: id,
        });
      });
    });
  }

  newPost = () => {
    console.log('Creating post...');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.other_user_id}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
      body: JSON.stringify({
        text: this.state.post_text,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          info: responseJson,
        });
        this.props.navigation.navigate("Friend's Wall");
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
      <View style={styles.flexContainer}>

        <TextInput
          style={styles.inputStyle}
          placeholder="Enter post here..."
          onChangeText={(post_text) => this.setState({ post_text })}
          value={this.state.post_text}
          multiline
        />

        <Button
          style={styles.buttonStyle}
          title="Create Post"
          onPress={() => this.newPost()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },

  buttonStyle: {
    width: 50,
    height: 50,
    alignItems: 'center',

  },

  inputStyle: {
    width: '80%',
    height: '50%',
    alignSelf: 'center',
  },
});

export default FriendPostScreen;
