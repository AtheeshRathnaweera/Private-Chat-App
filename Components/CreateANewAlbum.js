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
        messageList: ["first"],
        albumName: '',
        roomId: ''
    }

    async componentWillMount(){
        const roomID = await AsyncStorage.getItem('roomId');
        this.setState({
            roomId: roomID
        })

        console.warn("id : "+this.state.roomId)
    }

    getTheDateString(){
        const monthList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const timeNow = new Date();

        var date = timeNow.getDate();
        var month = timeNow.getMonth();
        var year = timeNow.getFullYear();

        if(date<10){
            date = "0"+date
        }

        const dateString = date + " "+monthList[month]+" , "+year

        return dateString

    }

    saveTheNewAlbum = () => {

        let msgId = firebase.database().ref('rooms/' + this.state.roomId + '/albums').push().key;

        const dateString = this.getTheDateString();
        console.warn("date : "+dateString)

        let album ={
            name: this.state.albumName,
            createdDate: dateString,
            Thumbnail: 'http://www.explorewalberswick.co.uk/images/photos/16.JPG'
        }

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
                    style={{  width: width * 0.9,backgroundColor: 'transparent',color: '#fff',
                    borderRadius: 15, borderWidth:1,borderColor: '#fff'}}
                    value={this.state.albumName}
                    onChangeText={(text) => this.setState({albumName: text})}
                    />
                    
                    <Button rounded style={{
                        width: width * 0.7, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', elevation: 8,
                        marginTop: 20,backgroundColor: '#A9A9A9'
                    }}>
                        <Text style={{ color: '#fff', fontSize: 17 }}> Create the album </Text>
                    </Button>

                   
                </Container>

            </ImageBackground>



        )
    }

}
