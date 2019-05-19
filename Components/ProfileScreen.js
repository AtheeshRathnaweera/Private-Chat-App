import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, TextInput, Alert, TouchableOpacity, Dimensions, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Button, Content, Thumbnail, Input, Item, Form, Label, Text } from 'native-base';
import firebase from 'firebase';

import ImagePicker from 'react-native-image-picker';

import RNFetchBlob from 'rn-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class ProfileScreen extends React.Component {

    constructor(props) {
        super(props);

        var options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

    }

    state = {
        name: '',
        status: '',
        userImageUrl: 'https://avatars0.githubusercontent.com/u/12028011?v=3&s=200',
        showSaveText: true,
        dataSaved: false,
        saveButtonColor: '#DAA520',
        dataSaving: false

    }




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

    }



    static navigationOptions = {
        title: 'Update Profile',
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'normal',
            color: '#fff',
        },

        headerStyle: {
            backgroundColor: '#1f5d64',
            color: '#fff'
        },

    }


    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    saveData = async () => {
        if (this.state.name.length < 3) {
            Alert.alert('Error', 'Please enter valid name.');
        } else {
            this.setState({
                showSaveText: false,
                dataSaving: true
            });

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
               // console.warn("Profile pic have changed");
                await AsyncStorage.setItem('userImageUrl', this.state.userImageUrl);
                updates['users/' + User.phone + '/User/imageUrl'] = this.state.userImageUrl;
                changesFound = true
            }

            if (changesFound) {
                // console.warn("changes found and will save");
                changesFound = false
                //firebase.database().ref('users').child(User.phone).update({ User });
                firebase.database().ref().update(updates, function (error) {
                    if (error) {
                        Alert.alert("Unexpected error", "This problem may occur because of the failure of your connection. Please check and try again.");
                    } else {
                        this.setState({
                            dataSaving: false,
                            dataSaved: true,
                            saveButtonColor: '#3F602B'
                        })

                    }
                }.bind(this));
            } else {
               // console.warn("nothing to save");
            }
        }

    }

    uploadImage(uri, mime = 'application/privateChatApp') {

        this.setState({
            showSaveText: false,
            dataSaving: true
        })

        return new Promise((resolve, reject) => {

            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null


            const imageRef = firebase.storage().ref('images').child('user' + User.phone)


            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                 
                    return Blob.build(data, { type: `${mime};BASE64` })
                })
                .then((blob) => {
                  
                    uploadBlob = blob
                    return imageRef.put(blob, { contentType: mime })
                })
                .then(() => {
                    uploadBlob.close()
                   

                    return imageRef.getDownloadURL()
                })
                .then((url) => {
                    resolve(url)
                })
                .catch((error) => {
                    console.warn("Error occured " + error);
                    reject(error)
                })
        })
    }



    changePicture = () => {
        // console.warn("Change picture method called.");

        ImagePicker.showImagePicker(this.options, (response) => {
            //console.warn('Response = ', response);

            if (response.didCancel) {
                console.warn('User cancelled image picker');
            } else if (response.error) {
                console.warn('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.warn('User tapped custom button: ', response.customButton);
            } else {
                // const uriSource = { uri: response.uri };


                // You can also display the image using data:
                const source = { uri: 'data:image/jpeg;base64,' + response.data };
                //console.warn("Received image uri : "+ source);
                //  this.uploadThePicture(uriSource)

                // this.setState({
                //    selectedImageUrl: source,
                //});

                this.uploadImage(response.uri)
                    .then(url => {
                        //alert('uploaded ' + url); 
                        this.setState({
                            userImageUrl: url,
                            dataSaving: false,
                            showSaveText: true
                        })
                    })
                    .catch(error => console.warn(error))

            }
        });

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

                            <Image large source={{uri: this.state.userImageUrl}}  style={styles.profileImg} />

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

                                width: width * 0.9, justifyContent: 'center', alignSelf: 'center', alignItems: 'center',
                                marginTop: 8, backgroundColor: this.state.saveButtonColor, elevation: 5
                            }}
                            onPress={this.state.dataSaved ? console.log("Once saved") : this.saveData}>

                            <Text style={{ color: '#F5FCFF', fontSize: 14 }}>{this.state.showSaveText ? " Save changes" : null}</Text>
                            {this.state.dataSaving ? <ActivityIndicator size="small" color="#fff" /> : null}
                            <Text style={{ color: '#F5FCFF', fontSize: 14 }}>{this.state.dataSaved ? "Saved successfully" : null}</Text>



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