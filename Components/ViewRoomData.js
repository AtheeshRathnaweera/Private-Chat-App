

import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, TextInput, Alert, TouchableOpacity, Clipboard, View, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Button, Text } from 'native-base';
import firebase from 'firebase';

export default class ViewRoomData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            roomId: props.navigation.getParam('roomID'),
            roomCreatedBy: 'Not found',
            roomCreatedDate: 'Not found',
            otherUserData: 'Not found',
            copyButtonText: 'Copy the id to the clipboard'

        }
    }


    static navigationOptions = {

        header: null

    }

    componentWillMount() {

        firebase.database().ref('rooms/' + this.state.roomId + '/roomData').once('value', function (snap) {
            if (snap.exists()) {
                let stringifyObject = JSON.stringify(snap)
                let obj = JSON.parse(stringifyObject);
                obj.key = snap.key

                const createdBy = JSON.stringify(obj.createdBy);
                const createdDate = JSON.stringify(obj.createdDate);
                const otherUser = JSON.stringify(obj.otherUser);

                const formattedCreatedBy = createdBy.replace(/^"(.*)"$/, '$1');
                const formattedCreatedDate = createdDate.replace(/^"(.*)"$/, '$1');
                const formattedOtherUser = otherUser.replace(/^"(.*)"$/, '$1');

                this.setState({
                    roomCreatedBy: formattedCreatedBy,
                    roomCreatedDate: formattedCreatedDate,
                    otherUserData: formattedOtherUser

                })

            } else {
                //room data not found
            }
        }.bind(this))
    }

    writeToClipboard = async () => {
        await Clipboard.setString(this.state.roomId);

        this.setState({
            copyButtonText: 'Copied to the clipboard'
        })

    }

    render() {


        return (

            <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>

                <Container style={{
                    flex: 1, backgroundColor: 'transparent', alignItems: 'center',
                    justifyContent: 'center'
                }}>

                    <View style={{
                        backgroundColor: 'transparent', alignItems: 'flex-start',
                        justifyContent: 'center', borderWidth: 1, borderColor: '#fff', padding: 10
                    }}>

                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>Room ID : </Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}>{this.state.roomId}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>Created date : </Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}>{this.state.roomCreatedDate}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>Created by : </Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}>{this.state.roomCreatedBy}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>Other user : </Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}>{this.state.otherUserData}</Text>
                        </View>

                    </View>

                    <Button style={{
                        position: 'absolute', bottom: 0, backgroundColor: '#A9A9A9', alignSelf: 'center',
                        borderRadius: 20, marginTop: 20, elevation: 10, paddingLeft: 5, paddingRight: 5, marginBottom: 30
                    }}
                        onPress={this.writeToClipboard}><Text style={{ color: '#fff' }}>{this.state.copyButtonText}</Text>
                    </Button>

                </Container>

            </ImageBackground>



        )
    }

}
