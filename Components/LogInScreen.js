import React from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Dimensions, Keyboard, ImageBackground,ActivityIndicator,YellowBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import firebase from 'firebase';

import { Button, Toast } from 'native-base';
import _ from 'lodash';


export default class LogInScreen extends React.Component {

  static navigationOptions = {
    header: null
  }

  state = {
    phone: '',
    name: '',
    roomId: '',
    partnerNum: '',
    status: '',
    image: '',
    heightWhenKeyboardOpened: 0,
    normalScreenHeight: 0,
    logginStarted : false

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

  saveDataToLocalStorage = async () => {

 
    await AsyncStorage.setItem('userPhone', this.state.phone);
    await AsyncStorage.setItem('roomId', this.state.roomId);
    await AsyncStorage.setItem('partnerPhone', this.state.partnerNum);
    await AsyncStorage.setItem('userName', this.state.name);
    await AsyncStorage.setItem('userStatus', this.state.status);
    await AsyncStorage.setItem('userImageUrl', this.state.image);
    await AsyncStorage.setItem('heightWhenKeyOpened', this.state.heightWhenKeyboardOpened);
    await AsyncStorage.setItem('normalScreenHeight', this.state.normalScreenHeight);
    await AsyncStorage.setItem('loggedIn', 'true');

  }

  submitForm = async () => {

    YellowBox.ignoreWarnings(['Setting a timer']);
        const _console = _.clone(console);
        console.warn = message => {
            if (message.indexOf('Setting a timer') <= -1) {
                _console.warn(message);
            }
        };

    if (this.state.phone.length < 10) {
      Alert.alert("Error", "Phone number is not valid")
    } else if (this.state.roomId.length == 0) {
      Alert.alert("Error", "Partner's phone number is not valid")
    } else {
      //Save the user
      try {
        // console.warn("Saving method started. "+this.state.heightWhenKeyboardOpened+" "+this.state.normalScreenHeight)

        this.setState({
          logginStarted: true
        })

        firebase.database().ref('rooms/'+this.state.roomId+'/').child(this.state.phone).once('value',function(snapshot){
          if(snapshot.exists()){

            let stringifyObject = JSON.stringify(snapshot)
            let obj = JSON.parse(stringifyObject);
            obj.key = snapshot.key

            const userName = JSON.stringify(obj.name);
            const userPhone = JSON.stringify(obj.phone);
            const userStatus = JSON.stringify(obj.status);
            const userParnerPhone = JSON.stringify(obj.partnerPhone);
            const userImageUrl = JSON.stringify(obj.imageUrl);

            const formattedPhone = userPhone.replace(/^"(.*)"$/, '$1');
            const formattedUserPhone = userParnerPhone.replace(/^"(.*)"$/, '$1');
            const formattedName = userName.replace(/^"(.*)"$/, '$1');
            const formattedUserUri = userImageUrl.replace(/^"(.*)"$/, '$1');
            const formattedUserStatus = userStatus.replace(/^"(.*)"$/, '$1');


            this.setState({
              phone: formattedPhone,
              name: formattedName,
              partnerNum: formattedUserPhone,
              status: formattedUserStatus,
              image: formattedUserUri
              
            })

            this.saveDataToLocalStorage().then(result => {
              this.props.navigation.navigate('App');

            }).catch(error => {
              Alert.alert("Process failed.", "Error occured. Check your network connection status and try again.")
              this.setState({
                logginStarted: false
              })

            })

          }else{
            Alert.alert("Process failed.", "You have no permission to enter this room. Please make sure you have entered the correct room id.")
            this.setState({
              logginStarted: false
            })
          }
        }.bind(this))

      } catch (e) {
        // room not found in the db
        Alert.alert("Room not found.", "You have entered an invalid room id. Make sure you have entered the correct room id.")
        this.setState({
          logginStarted: false
        })
      }
    }
  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (

      <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>

        <View style={styles.container}>

          <TextInput
            placeholder="Your phone number"
            placeholderTextColor='#A9A9A9'
            keyboardType="number-pad"
            style={styles.input}
            value={this.state.phone}
            onChangeText={this.handleChange('phone')} />

          <TextInput
            placeholder="Room id"
            placeholderTextColor='#A9A9A9'
            keyboardType="number-pad"
            style={styles.input}
            value={this.state.roomId}
            onChangeText={this.handleChange('roomId')} />

          <Text style={{ color: '#F5FCFF', fontSize: 14, width: 340, paddingRight: 10, paddingLeft: 10 }}>*Make sure that you and your partner use the same room id here</Text>

          <Button rounded
            style={{ width: width * 0.8, justifyContent: 'center', alignSelf: 'center', marginTop: 10, backgroundColor: '#DAA520', elevation: 9 }}
            onPress={this.submitForm}>
              <Text style={{ color: '#F5FCFF', fontSize: 16, alignSelf: 'center' }}> {this.state.logginStarted ? null : 'Join the room'} </Text>

  {this.state.logginStarted ? <ActivityIndicator size="small" color="#fff" /> :  null}

          </Button>

          <Button rounded
            style={{ position: 'absolute', bottom: 0, width: width * 0.8, justifyContent: 'center', marginBottom: 30, alignSelf: 'center', backgroundColor: '#A9A9A9', elevation: 9 }}
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
