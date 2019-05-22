

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
            roomCreatorName: 'Not found',
            roomCreatorNum: 'Not found',
            otherUserName: 'Not found',
            otherUserNum: 'Not found',
            createdDate: 'Not found',
            copyButtonText: 'Copy id to the clipboard'

        }
    }


    static navigationOptions = {

        header: null

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

                    <View style={{ backgroundColor: 'transparent', alignItems: 'flex-start', 
                    justifyContent: 'center', borderWidth: 1, borderColor: '#fff',padding:10 }}>

                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>Room ID : </Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}>{this.state.roomId}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>Created date : </Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}>{this.state.createdDate}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>Created by : </Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}>{this.state.roomCreatorName}</Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}> ( {this.state.roomCreatorNum} )</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Text style={{ color: '#fff', fontSize: 15 }}>Other user : </Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}>{this.state.otherUserName}</Text>
                            <Text style={{ color: '#fff', fontSize: 16 }}> ( {this.state.otherUserNum} )</Text>
                        </View>

                    </View>


                    <Button style={{ backgroundColor: '#A9A9A9', alignSelf: 'center', borderRadius: 20, marginTop: 20, elevation: 10 }}
                        onPress={this.writeToClipboard}><Text style={{ color: '#fff' }}>{this.state.copyButtonText}</Text>
                    </Button>

                </Container>

            </ImageBackground>



        )
    }

}
