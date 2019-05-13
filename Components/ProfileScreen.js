import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, TextInput, Alert, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';


import firebase from 'firebase';

export default class ProfileScreen extends React.Component{

    static navigationOptions ={
        title: 'Profile'
    }

    state = {
        name: User.name
    }

    handleChange = key => val =>  {
        this.setState({[key]: val})
    }

    changeName = async () => {
        if(this.state.name.length < 3){
            Alert.alert('Error','Please enter valid name.');
        }else if(User.name !== this.state.name){
            firebase.database().ref('users').child(User.phone).set({name: this.state.name});
            User.name = this.state.name;
            Alert.alert('Success','Name changed successfully.');
        }
        
    }

    logOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
        Alert.alert("LogOut","Button pressed.");

    }

    render(){
        return(
            <SafeAreaView style={styles.container}>
   
                <Text style={{fontSize:20}}>
                    {User.phone}
                </Text>

                <TextInput
                style={styles.input}
                value={this.state.name}
                onChangeText={this.handleChange('name')}/>

                <TouchableOpacity onPress={this.changeName}>
                    <Text style={styles.btnText}>Change Name</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.logOut}>
                    <Text style={styles.btnText}>Logout</Text>
                </TouchableOpacity>
                

            </SafeAreaView>

        )
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
    },
    btnText: {
        color: 'darkblue',
        fontSize: 20
    }
});