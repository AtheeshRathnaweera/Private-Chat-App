import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    View,
    Text,
    StyleSheet,
    Alert
} from 'react-native';

import User from '../User';
import AsyncStorage from '@react-native-community/async-storage';

import firebase from 'firebase';
import NetInfo from "@react-native-community/netinfo";




export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.testNetCheck();
    }

   


    componentWillMount() {
      

        var firebaseConfig = {
            apiKey: "AIzaSyA5SEkctVYo1KU0jlYU_OZ0UFII8t0-vPA",
            authDomain: "privatechatapp-601d1.firebaseapp.com",
            databaseURL: "https://privatechatapp-601d1.firebaseio.com",
            projectId: "privatechatapp-601d1",
            storageBucket: "privatechatapp-601d1.appspot.com",
            messagingSenderId: "451878681021",
            appId: "1:451878681021:web:7cac106060a18de5"
        };
        // Initialize Firebase

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        

    }

    // Fetch the token from storage then navigate to our appropriate place
    testNetCheck = async () => {
        const listener = data => {
            //console.warn("Connection type", data.type);
            //console.warn("Connection effective type", data.effectiveType);

            if (data.type === "cellular" || data.type === "wifi" || data.type === "wimax") {

                //console.warn("second if started.");

                if (data.type === "cellular") {

                    if(data.effectiveType === "unknown"){
                        this.showTheAlert();
                        //console.warn("Network unknown.");
                    }else{
                        NetInfo.removeEventListener('connectionChange', listener);
                        this.startTheApp();
                    }
                   

                } else {
                    //console.warn("Network connected app is started.");
                    NetInfo.removeEventListener('connectionChange', listener);
                    this.startTheApp();

                }

            } else {
                this.showTheAlert();
            }


          };
          
          // Subscribe
          const subscription = NetInfo.addEventListener('connectionChange', listener);
          NetInfo.isConnected.removeEventListener('connectionChange', listener);

          // Unsubscribe through remove
          //subscription.remove();
    };


    showTheAlert = () => {
        Alert.alert(
            "Connection Error",
            "Please check your connection availability!",
            [
                { text: "Ok", style: 'cancle'}
            ]
        )

    }

    startTheApp = async () => {
        
      
            User.phone = await AsyncStorage.getItem('userPhone');
            this.props.navigation.navigate(User.phone ? 'App' : 'Auth');//Go to the stack if phone number is available
     
     
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>

                <ActivityIndicator color="#fff"/>
                <StatusBar barStyle="default" />
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
        width: '90%',
        marginBottom: 7,
        borderRadius: 5
    }
});