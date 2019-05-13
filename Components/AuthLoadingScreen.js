import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    View,
    Text,
    StyleSheet
} from 'react-native';

import User from '../User';
import AsyncStorage from '@react-native-community/async-storage';

import firebase from 'firebase';

export default class AuthLoadingScreen extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
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
        firebase.initializeApp(firebaseConfig);

    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        User.phone = await AsyncStorage.getItem('userPhone');
        this.props.navigation.navigate(User.phone ? 'App' : 'Auth');//Go to the stack if phone number is available
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
        
                <ActivityIndicator />
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
        backgroundColor: '#F5FCFF',
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