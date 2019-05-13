import React from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import firebase from 'firebase';


export default class LogInScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  state = {
    phone: '',
    name: ''
  }
 
  handleChange = key => val => {
    this.setState({ [key]: val })
  }


  submitForm = async () => {
    if (this.state.phone.length < 10) {
      Alert.alert("Error", "Wrong phone number")
    } else if (this.state.name.length < 3) {
      Alert.alert("Error", "Wrong name")
    } else {
      //Save the user
      try {
        await AsyncStorage.setItem('userPhone', this.state.phone);
        User.phone = this.state.phone;

        firebase.database().ref('users/'+User.phone).set({name: this.state.name});// Save user name in firebase under the phone number

        this.props.navigation.navigate('App');
      } catch (e) {
        // saving error
        Console.log(e.message);
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
          placeholder="Phone number"
          keyboardType="number-pad"
          style={styles.input}
          value={this.state.phone}
          onChangeText={this.handleChange('phone')} />

        <TextInput
          placeholder="Name"
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChange('name')} />

        <TouchableOpacity onPress={this.submitForm}>
          <Text style={{ color: 'darkblue', fontSize: 17 }}>Enter</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '90%',
    marginBottom: 7,
    borderRadius: 5
  }
});
