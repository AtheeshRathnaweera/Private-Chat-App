import React from 'react';
import { Text, Keyboard, StyleSheet, TextInput, Alert, YellowBox, Dimensions, View, ImageBackground, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import _ from 'lodash';

import { Button } from 'native-base';
import firebase from 'firebase';

export default class CreateARoomID extends React.Component {

    static navigationOptions = {

        header: null

    }

    state = {
        phone: '',
        name: '',
        partnerNum: '',
        partnerName: '',
        heightWhenKeyboardOpened: 0,
        normalScreenHeight: 0,
        roomCreating: false,
        roomId: '',
        clipboardText: null,
        copyButtonText: 'Copy the id to clipboard'

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

    saveDataLocally = async () => {


        await AsyncStorage.setItem('roomId', this.state.roomId);
        await AsyncStorage.setItem('userPhone', this.state.phone);
        await AsyncStorage.setItem('partnerPhone', this.state.partnerNum);
        await AsyncStorage.setItem('userName', this.state.name);
        await AsyncStorage.setItem('userStatus', 'no status');
        await AsyncStorage.setItem('userImageUrl', 'https://image.flaticon.com/icons/png/512/149/149074.png');
        await AsyncStorage.setItem('heightWhenKeyOpened', this.state.heightWhenKeyboardOpened);
        await AsyncStorage.setItem('normalScreenHeight', this.state.normalScreenHeight);
        await AsyncStorage.setItem('loggedIn', 'true');

    }

    savePartnerDataInFirebase = async (roomId) => {

        YellowBox.ignoreWarnings(['Setting a timer']);
        const _console = _.clone(console);
        console.warn = message => {
            if (message.indexOf('Setting a timer') <= -1) {
                _console.warn(message);
            }
        };

        firebase.database().ref('rooms/' + roomId + '/' + this.state.partnerNum).set({
            name: this.state.partnerName,
            phone: this.state.partnerNum,
            partnerPhone: this.state.phone,
            status: 'not set',
            imageUrl: 'https://image.flaticon.com/icons/png/512/149/149074.png'
        }, function (error) {
            if (error) {
                Alert.alert("User adding failed", "Can't add your partner to this room.Please try again by creating a new room.");
            } else {


            }
        }.bind(this));

    }

    createTheRoom = async () => {

        YellowBox.ignoreWarnings(['Setting a timer']);
        const _console = _.clone(console);
        console.warn = message => {
            if (message.indexOf('Setting a timer') <= -1) {
                _console.warn(message);
            }
        };

        if (this.state.phone.length < 10) {
            Alert.alert("Error", "Your phone number is not valid")
        } else if (this.state.name.length < 3) {
            Alert.alert("Error", "Name should include atleast three letters")
        } else if (this.state.partnerNum.length < 10 || (this.state.phone === this.state.partnerNum)) {
            Alert.alert("Error", "Partner's phone number is not valid")
        } else if (this.state.partnerName.length < 3) {
            Alert.alert("Error", "Partner's name is not valid.")
        } else {
            //Save the user

            this.setState({
                roomCreating: true
            })

            try {
                // console.warn("Saving method started. "+this.state.heightWhenKeyboardOpened+" "+this.state.normalScreenHeight)

                let roomID = firebase.database().ref('rooms').push().key;//get the created new room id

                if (roomID !== '') {
                    //console.warn("Room created." + roomID);

                    this.setState({
                        roomId: roomID
                    })

                    firebase.database().ref('rooms/' + roomID + '/' + this.state.phone).set({
                        name: this.state.name,
                        phone: this.state.phone,
                        partnerPhone: this.state.partnerNum,
                        status: 'no status',
                        imageUrl: 'https://image.flaticon.com/icons/png/512/149/149074.png'
                    }, function (error) {
                        if (error) {
                            Alert.alert("Process failed", "Can't add you to this room.Please try again by creating a new room.");
                            this.setState({
                                roomCreating: false,

                            })
                        } else {

                            //Adding the partner if only creator added successfully


                            this.savePartnerDataInFirebase(roomID).then(result => {



                                this.saveDataLocally().then(result => {

                                    this.props.navigation.navigate('App');

                                }).catch(error => {

                                    Alert.alert("Process failed.", "Error occured. Check your network connection status and try again.")
                                    this.setState({
                                        roomCreating: false
                                    })
                                })

                            }).catch(error => {
                                // console.warn("savepartner firebase async received error : "+error.message);
                                Alert.alert("Process failed.", "Error occured. Check your network connection status and try again.")
                                this.setState({
                                    roomCreating: false
                                })
                            })

                        }
                    }.bind(this));



                } else {
                    Alert.alert("Failed to create the room", "This problem may occur because of the failure of your connection. Please check and try again.");
                    this.setState({
                        roomCreating: false
                    })
                }

            } catch (e) {
                // saving error
                //console.warn("firebase exception: " + e.message);
                Alert.alert("Process failed.", "Error occured. Check your network connection status and try again.")
                this.setState({
                    roomCreating: false
                })
            }

        }

    }

    render() {

        let { height, width } = Dimensions.get('window');
        return (

            <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>


                {this.state.roomCreating ?

                    <View style={styles.container}>

                        <ActivityIndicator color='#fff' />

                    </View>

                    :

                    <View style={styles.container}>

                        <TextInput
                            placeholder="Your phone number"
                            placeholderTextColor='#A9A9A9'
                            keyboardType="number-pad"
                            style={styles.input}
                            value={this.state.phone}
                            onChangeText={this.handleChange('phone')} />

                        <TextInput
                            placeholder="Your nick name"
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

                        <TextInput
                            placeholder="Partner's nick name"
                            placeholderTextColor='#A9A9A9'
                            style={styles.input}
                            value={this.state.partnerName}
                            onChangeText={this.handleChange('partnerName')} />

                        <Text style={{ color: '#F5FCFF', fontSize: 14, width: 340, paddingRight: 10, paddingLeft: 10 }}>*Make sure you have added your partner's current phone number correctly.
                    You can't change the his/her number after you created the room. </Text>

                        <Button rounded
                            style={{ width: width * 0.8, justifyContent: 'center', alignSelf: 'center', marginTop: 10, backgroundColor: '#A9A9A9', elevation: 7 }}
                            onPress={this.createTheRoom}>

                            <Text style={{ color: '#F5FCFF', fontSize: 16, alignSelf: 'center' }}>Create the room</Text>

                        </Button>

                    </View>
                }

            </ImageBackground>



        )
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