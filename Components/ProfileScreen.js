import React from 'react';
import { View, SafeAreaView, StyleSheet, TextInput, Alert, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Button, Content, Thumbnail, Input, Item, Form, Label, Text } from 'native-base';
import firebase from 'firebase';


export default class ProfileScreen extends React.Component {

    async componentDidMount() {

  
        const uName = await AsyncStorage.getItem('userName');
        const uStatus = await AsyncStorage.getItem('userStatus');
        const uImUrl = await AsyncStorage.getItem('userImageUrl');

        User.name = uName;
        User.status = uStatus;
        User.imageUrl = uImUrl;


        this.setState({
            name: uName,
            status: uStatus,
            userImageUrl: uImUrl,

        });

        //console.warn("data" + User.name + " " + User.status + " " + User.imageUrl);
    }

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
        name: '',
        status: '',
        userImageUrl: '',
        dataSaved: false,
        saveButtonColor: '#DAA520'

    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    saveData = async () => {
        if (this.state.name.length < 3) {
            Alert.alert('Error', 'Please enter valid name.');
        } else {

            var updates = {};
            var changesFound = false
            // updates['/posts/' + newPostKey] = postData;
            // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

            // return firebase.database().ref().update(updates);

            if (this.state.name !== User.name) {
                await AsyncStorage.setItem('userName', this.state.name);//Update the data in async storage
                updates['users/' + User.phone + '/User/name'] = this.state.name;
                changesFound = true

            }
            if (this.state.status !== User.status) {
                await AsyncStorage.setItem('userStatus', this.state.status);
                updates['users/' + User.phone + '/User/status'] = this.state.status;
                changesFound = true
            }
            if (this.state.userImageUrl !== User.imageUrl) {
                await AsyncStorage.setItem('userImageUrl', this.state.userImageUrl);
                updates['users/' + User.phone + '/User/imageUrl'] = this.state.userImageUrl;
                changesFound = true
            }

            if (changesFound) {
                console.warn("changes found and will save");
                changesFound = false
                //firebase.database().ref('users').child(User.phone).update({ User });
                firebase.database().ref().update(updates, function (error) {
                    if (error) {
                        Alert.alert("Unexpected error", "This problem may occur because of the failure of your connection. Please check and try again.");
                    } else {
                        this.setState({ dataSaved: true })
                        this.setState({ saveButtonColor: '#3F602B' })
                    }
                }.bind(this));
            } else {
                console.warn("nothing to save");
            }
        }

    }

    changePicture() {
        console.warn("Change picture method called.");
    }


    logOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');

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

                        <TouchableOpacity
                            onPress={this.changePicture}>
                            <Text style={{ fontStyle: 'italic', fontSize: 14, color: '#EAC117', marginBottom: 10, marginTop: 3, textDecorationLine: 'underline' }}>
                                Change display picture
                            </Text>
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
                            value={this.state.status}
                            onChangeText={this.handleChange('status')} />

                        <Button rounded
                            style={{

                                width: width * 0.9, justifyContent: 'center', alignSelf: 'center',
                                marginTop: 8, backgroundColor: this.state.saveButtonColor, elevation: 5
                            }}
                            onPress={this.state.dataSaved ? console.log("Once saved") : this.saveData}>

                            <Text style={{ color: '#F5FCFF', fontSize: 14 }}>{this.state.dataSaved ? "Saved successfully " : "Save changes"}</Text>

                        </Button>

                        <Button rounded
                            style={{
                                width: width * 0.9, justifyContent: 'center', alignSelf: 'center',
                                marginTop: 10, backgroundColor: '#a60000', elevation: 5
                            }}
                            onPress={this.logOut}>

                            <Text style={{ color: '#F5FCFF', fontSize: 14 }}>Log out</Text>

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