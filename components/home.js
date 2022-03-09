import React, { Component } from 'react';
import {
  Text, View, Button, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FeedScreen from './feed';
import ProfileScreen from './profile';
import FriendsScreen from './friends';
import RequestsScreen from './requests';
import SearchScreen from './search';

const getData = async (done) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@spacebook_details');
    const data = JSON.parse(jsonValue);
    return done(data);
  } catch (e) {
    console.error(e);
  }
};

const Tab = createBottomTabNavigator();

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
    };
  }

  componentDidMount() {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
      });
    });
  }

  refresh = this.props.navigation.addListener('focus', () => {
    getData((data) => {
      this.setState({
        login_info: data,
        isLoading: false,
      });
    });
  });

  logout = () => {
    fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.state.login_info.token,
      },

    })
      .then((json) => {
        console.log(json);
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.error(error);
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
      <View style={{ flex: 1, alignItems: 'space-around', justifyContent: 'space-around' }}>

        <Button
          style={styles.buttonStyle}
          title="Log Out"
          onPress={() => this.logout()}
        />

        <Tab.Navigator
          style={{ justifyContent: 'center' }}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Feed') {
                iconName = focused
                  ? 'home'
                  : 'home-outline';
              } else if (route.name === 'Profile') {
                iconName = focused
                  ? 'person'
                  : 'person-outline';
              } else if (route.name === 'Friends') {
                iconName = focused
                  ? 'people'
                  : 'people-outline';
              } else if (route.name === 'Requests') {
                iconName = focused
                  ? 'person-add'
                  : 'person-add-outline';
              } else if (route.name === 'Search') {
                iconName = focused
                  ? 'search'
                  : 'search-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name="Feed" component={FeedScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Friends" component={FriendsScreen} />
          <Tab.Screen name="Requests" component={RequestsScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
        </Tab.Navigator>

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
});

export default HomeScreen;
