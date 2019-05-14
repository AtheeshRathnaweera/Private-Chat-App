import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, Alert, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Button, Content, Thumbnail, Input, Item, Form, Label } from 'native-base';
import firebase from 'firebase';

export default class ProfileScreen extends React.Component {

    static navigationOptions = {
        title: 'Update Profile',
        headerTitleStyle: {
            fontWeight: 'normal',
            color: '#fff',
        },

        headerStyle: {
            backgroundColor: '#1f5d64',
            color: '#fff'
        },

    }

    state = {
        name: User.name
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    changeName = async () => {
        if (this.state.name.length < 3) {
            Alert.alert('Error', 'Please enter valid name.');
        } else if (User.name !== this.state.name) {
            firebase.database().ref('users').child(User.phone).set({ name: this.state.name });
            User.name = this.state.name;
            Alert.alert('Success', 'Name changed successfully.');
        }

    }

    logOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
        Alert.alert("LogOut", "Button pressed.");

    }

    render() {
        let { height, width } = Dimensions.get('window');

        return (
            <Container style={{
                flex: 1, backgroundColor: '#1f5d64', alignItems: 'center',
                flexDirection: 'row', justifyContent: 'center'
            }}>

                <Content contentContainerStyle={{ alignItems: 'center' }}  >

                    <Form style={{
                        flex: 1, width: width * 0.9, height: height * 0.8,
                        alignItems: 'center', justifyContent: 'center'
                    }}>

                        <TouchableOpacity
                            //onPress={() => this.props.navigation.navigate('chatScreen', item)}
                            style={[styles.profileImgContainer, { borderColor: '#fff', borderWidth: 1 }]}>

                            <Thumbnail large source={require('../images/man.png')} style={styles.profileImg} />

                        </TouchableOpacity>


                        <Text style={{ fontSize: 16, color: '#fff', marginBottom: 15, marginTop: 3 }}>
                            {User.phone}
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={this.state.name}
                            onChangeText={this.handleChange('name')} />

                        <TextInput
                            multiline={true}
                            numberOfLines={4}
                            style={styles.input}
                            value={this.state.name}
                            onChangeText={this.handleChange('name')} />

                        <Button rounded
                            style={{
                                width: width * 0.9, justifyContent: 'center', alignSelf: 'center',
                                marginTop: 8, backgroundColor: '#DAA520', elevation: 5
                            }}
                            onPress={this.changeName}>

                            <Text style={{ color: '#F5FCFF', fontSize: 16 }}>Save changes</Text>

                        </Button>

                        <Button rounded
                            style={{
                                width: width * 0.9, justifyContent: 'center', alignSelf: 'center',
                                marginTop: 10, backgroundColor: '#a60000', elevation: 5
                            }}
                            onPress={this.logOut}>

                            <Text style={{ color: '#F5FCFF', fontSize: 16 }}>Log out</Text>

                        </Button>


                    </Form>

                </Content>

            </Container>

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
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
        marginBottom: 7,
        borderRadius: 13,
        color: '#fff'
    },
    btnText: {
        color: 'darkblue',
        fontSize: 20
    },
    profileImg: {
        height: 120,
        width: 120
    },
    profileImgContainer: {
        height: 120,
        width: 120,
        borderRadius: 60,
        overflow: 'hidden'
    },
});