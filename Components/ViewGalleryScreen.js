import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, TextInput, Alert, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Button, Content, Thumbnail, Input, Item, Form, Label, Text } from 'native-base';
import firebase from 'firebase';



export default class ViewGalleryScreen extends React.Component {





    static navigationOptions = {

        header : null
        //title: 'Update Profile',
       // headerTintColor: '#fff',
        //headerTitleStyle: {
       //     fontWeight: 'normal',
       //     color: '#fff',
       // },

       // headerStyle: {
       //     backgroundColor: '#1f5d64',
      //      color: '#fff'
      //  },

    }


   

    render() {
    

        return (

            <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>

     
            <Container style={{
                flex: 1, backgroundColor: 'transparent', alignItems: 'center',
                flexDirection: 'row', justifyContent: 'center'
            }}>

                <Text style={{color: '#fff'}}>This is the view gallery screen</Text>

     

            </Container>

            </ImageBackground>

       

        )
    }

}
