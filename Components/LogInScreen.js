import React from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Dimensions, Keyboard, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import firebase from 'firebase';

import { Button, Toast } from 'native-base';


export default class LogInScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  state = {
    phone: '',
    name: '',
    partnerNum: '',
    heightWhenKeyboardOpened: 0,
    normalScreenHeight: 0

  }

  handleChange = key => val => {
    this.setState({ [key]: val })
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow
    );

  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
  }

  _keyboardDidShow = (e) => {


    var normalHeight = Dimensions.get('window').height;
    var shortHeight = Dimensions.get('window').height - e.endCoordinates.height;

    //console.warn("Keyboard show " + this.state.keyboardOpened + " " + shortHeight + " normal: " + normalHeight + " " + keyboardHeight);

    this.setState({
      heightWhenKeyboardOpened: shortHeight + '',
      normalScreenHeight: normalHeight + ''
    })

  }

  submitForm = async () => {

    if (this.state.phone.length < 10) {
      Alert.alert("Error", "Phone number is not valid")
    } else if (this.state.name.length < 3) {
      Alert.alert("Error", "Name should include atleast three letters")
    } else if (this.state.partnerNum.length < 10) {
      Alert.alert("Error", "Partner's phone number is not valid")
    } else {
      //Save the user
      try {
        // console.warn("Saving method started. "+this.state.heightWhenKeyboardOpened+" "+this.state.normalScreenHeight)

        await AsyncStorage.setItem('userPhone', this.state.phone);
        await AsyncStorage.setItem('partnerPhone', this.state.partnerNum);
        await AsyncStorage.setItem('userName', this.state.name);
        await AsyncStorage.setItem('userStatus', 'no status');
        await AsyncStorage.setItem('userImageUrl', 'not set');
        await AsyncStorage.setItem('heightWhenKeyOpened', this.state.heightWhenKeyboardOpened);
        await AsyncStorage.setItem('normalScreenHeight', this.state.normalScreenHeight);

        User.phone = this.state.phone;
        User.name = this.state.name;
        User.status = 'no status';
        User.imageUrl = 'not set';

        firebase.database().ref('users/' + User.phone).set({ User }, function (error) {
          if (error) {
            // The write failed...
            Alert.alert("Unexpected error", "This problem may occur because of the failure of your connection. Please check and try again.");
          } else {
            this.props.navigation.navigate('App');
          }
        }.bind(this));

      } catch (e) {
        // saving error
        console.warn("firebase exception: " + e.message);
      }



    }
  }

  savingStuff = async () => {


  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (

      <ImageBackground source={require('../images/backThree.jpg')} style={{ flex: 1, width: null, height: null }}>

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
            placeholder="Room id"
            placeholderTextColor='#A9A9A9'
            keyboardType="number-pad"
            style={styles.input}
            value={this.state.partnerNum}
            onChangeText={this.handleChange('partnerNum')} />

          <Text style={{ color: '#F5FCFF', fontSize: 14, width: 340, paddingRight: 10, paddingLeft: 10 }}>*Make sure that you and your partner use the same room id here</Text>

          <Button rounded
            style={{ width: width * 0.8, justifyContent: 'center', alignSelf: 'center', marginTop: 10, backgroundColor: '#DAA520', elevation: 7 }}
            onPress={this.submitForm}>

            <Text style={{ color: '#F5FCFF', fontSize: 16, alignSelf: 'center' }}>Join the room</Text>

          </Button>

          <Button rounded
            style={{ position: 'absolute', bottom: 0, width: width * 0.8, justifyContent: 'center', marginBottom: 30, alignSelf: 'center', backgroundColor: '#DAA520', elevation: 7 }}
            onPress={() => this.props.navigation.navigate('createANewRoom')}>

            <Text style={{ color: '#F5FCFF', fontSize: 16, alignSelf: 'center' }}>Create a new room</Text>

          </Button>

        </View>

      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  input: {
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#ccc',
    color: '#fff',
    width: '90%',
    marginBottom: 7,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: 'transparent',

  }
});
