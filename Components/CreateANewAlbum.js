import React from 'react';
import { View, FlatList, Text, Platform, StyleSheet, TextInput, Alert, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Card, Button, Thumbnail, CardItem, Right, Icon, Left, Body } from 'native-base';
import firebase from 'firebase';

export default class CreateANewAlbum extends React.Component {

    static navigationOptions = {

        header: null
    }

    state = {
        messageList: ["first"]
    }

  

    render() {

        let { height, width } = Dimensions.get('window');

        return (

            <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>


                <Container style={{
                    flex: 1, backgroundColor: 'transparent', alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center'
                }}>

                    <TextInput 
                    placeholder={'Enter the album name'}
                    style={{  width: width * 0.9,backgroundColor: 'transparent',color: '#fff',borderWidth:1,borderColor: '#fff'}}
                    />
                    
                    <Button transparent style={{
                        width: width * 0.9, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', elevation: 8, borderWidth: 1, borderColor: '#fff'
                    }}>
                        <Text style={{ color: '#fff', fontSize: 17 }}> Create the album </Text>
                    </Button>

                   
                </Container>

            </ImageBackground>



        )
    }

}
