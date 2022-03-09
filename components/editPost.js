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

const getPost = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@post');
    const data = JSON.parse(jsonValue);
    return done(data);
  } catch (e) {
    console.error(e);
  }
};

class EditPostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      post: {},
      new_text: '',
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
        post: {},
        new_text: '',
      });

      getPost((value) => {
        this.setState({
          post: value,
        });
      });
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
        post: {},
        new_text: '',
      });

      getPost((value) => {
        this.setState({
          post: value,
        });
      });
    });
  });

  editPost = () => {
    const to_send = this.state.post;
    to_send.text = this.state.new_text;
    console.log('Updating post...');
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.login_info.id}/post/${this.state.post.post_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },
      body: JSON.stringify(to_send),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
        });
      })
      .then(this.props.navigation.navigate('Home'))
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
          placeholder={this.state.post.text}
          onChangeText={(new_text) => this.setState({ new_text })}
          defaultValue={this.state.post.text}
          multiline
        />

        <Button
          style={styles.buttonStyle}
          title="Update"
          onPress={() => {
            this.editPost();
          }}
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

export default EditPostScreen;
