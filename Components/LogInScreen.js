import React from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import firebase from 'firebase';

import { Button } from 'native-base';


export default class LogInScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  state = {
    phone: '',
    name: '',
    partnerNum: '',
  }

  handleChange = key => val => {
    this.setState({ [key]: val })
  }


  submitForm = async () => {

    if (this.state.phone.length < 10) {
      Alert.alert("Error", "Phone number is not valid")
    } else if (this.state.name.length < 3) {
      Alert.alert("Error", "Name should include atleast three letters")
    } else if(this.state.partnerNum.length < 10){
      Alert.alert("Error", "Partner's phone number is not valid")
    }else{
      //Save the user
      try {

        U
        await AsyncStorage.setItem('userPhone', this.state.phone);
        await AsyncStorage.setItem('partnerPhone', this.state.partnerNum);
        await AsyncStorage.setItem('userName', this.state.name);


        User.phone = this.state.phone;

        firebase.database().ref('users/' + User.phone).set({ name: this.state.name });// Save user name in firebase under the phone number

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
          placeholder="Your phone number"
          placeholderTextColor='#A9A9A9'
          keyboardType="number-pad"
          style={styles.input}
          value={this.state.phone}
          onChangeText={this.handleChange('phone')} />

        <TextInput
          placeholder="Your name"
          placeholderTextColor='#A9A9A9'
          style={styles.input}
          value={this.state.name}
          onChangeText={this.handleChange('name')} />

          

        <TextInput
          placeholder="Partner's phone number"
          placeholderTextColor='#A9A9A9'
          keyboardType="number-pad"
          style={styles.input}
          value={this.state.partnerNum}
          onChangeText={this.handleChange('partnerNum')} />

        <Button rounded 
          style={{ width: 150, justifyContent: 'center', alignSelf: 'center', marginTop:10, backgroundColor: '#DAA520',elevation:10 }}
          onPress={this.submitForm}>

          <Text style={{ color: '#F5FCFF', fontSize: 16 }}>Start chatting</Text>

        </Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1f5d64',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
    width: '90%',
    marginBottom: 7,
    borderRadius: 5,
    elevation:3,
    backgroundColor: '#1f5d64',
    
  }
});
