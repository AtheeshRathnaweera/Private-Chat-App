import React from 'react';
import { View, Platform, Button, Text, ActivityIndicator, StyleSheet, Modal, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Card, Thumbnail, CardItem, Right, Icon, Left, Body } from 'native-base';
import firebase from 'firebase';

import ImagePicker from 'react-native-image-picker';

import ImageBrowser from 'react-native-interactive-image-gallery';

import _ from 'lodash';

import RNFetchBlob from 'rn-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob


export default class ViewPhoto extends React.Component {

    static navigationOptions = {

        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            roomId: '',
            albumId: props.navigation.getParam('albumId'),
            albumName: props.navigation.getParam('albumName'),
            photos: [],
            photoUrl: '',
            loading: true,
            ModalVisibleStatus: false,
            dataSaving: false,
            numberOfPhotosInAlbum: ''
        }

        var options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }


    }

    addNewImageToAlbum = async (url) => {

        let newImageId = firebase.database().ref('rooms/' + this.state.roomId + '/photos/' + this.state.albumId).push().key;
        let updates = {};

        imageData = {
            src: url
        }

        firebase.database().ref('rooms/' + this.state.roomId + '/albums/' + this.state.albumId).update({
            Thumbnail: url
        });

        updates['rooms/' + this.state.roomId + '/photos/' + this.state.albumId + "/" + newImageId] = imageData;
        firebase.database().ref().update(updates, function (error) {

            if (error) {
                Alert.alert("Image not added", "Unexpected error occured.");
            } else {
                //Image added successfully
                this.setState({
                    dataSaving: false
                })
            }
        }.bind(this)
        );

    }

    async componentWillMount() {

        const roomID = await AsyncStorage.getItem('roomId');

        this.setState({
            roomId: roomID
        })

        //console.warn(this.state.albumId)

        firebase.database().ref('rooms/' + this.state.roomId + '/photos/' + this.state.albumId)
            .on('child_added', (value) => {

                this.setState((prevState) => {

                    return {

                        photos: [...prevState.photos, value.val()],
                        numberOfPhotosInAlbum: this.state.photos.length

                    }
                })

                this.setState({

                    loading: false,

                })

            })
    }

    uploadToFirebaseImage(uri, mime = 'application/privateChatApp') {
        //Upload to firebase storage
        return new Promise((resolve, reject) => {

            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null

           

            const imageRef = firebase.storage().ref('albumPhotos').child(this.state.albumId + (this.state.numberOfPhotosInAlbum + 1))
           

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


    selectAnNewImage = () => {

        ImagePicker.showImagePicker(this.options, (response) => {

            this.setState({
                dataSaving: true
            })

            if (response.didCancel) {
                console.log('User cancelled image picker');
                this.setState({
                    dataSaving: false
                })
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                this.setState({
                    dataSaving: false
                })
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                this.setState({
                    dataSaving: false
                })
            } else {
                const source = { uri: response.uri };

                this.uploadToFirebaseImage(response.uri)
                    .then(url => {
                        //alert('uploaded ' + url); 

                        this.addNewImageToAlbum(url);//Add the saved image url into the album

                        this.setState({
                            userImageUrl: url
                        })
                    })
                    .catch(error => console.warn(error))

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };


            }
        });
    }



    renderItem = ({ item, itemSize, itemPaddingHorizontal }) => {
    
        let { height, width } = Dimensions.get('window');

        return (

            <TouchableOpacity
                style={{
                    width: 100,
                    height: 100,
                    paddingHorizontal: itemPaddingHorizontal
                }}
                onPress={() => { this.ShowModalFunction(true, item) }}>

                <Image
                    resizeMethod="resize"
                    style={{ flex: 1 }}
                    source={{ uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png' }} />

            </TouchableOpacity>

        )
    }

    renderEmptyContainer() {
        let { height, width } = Dimensions.get('window');

        return (
            <View style={{ height: height * 0.8, justifyContent: 'center', alignContent: 'center' }}>

                <Text style={{ color: '#fff' }}>No albums to show</Text>

            </View>
        )
    }

    renderHeader() {
        //Header of the Screen
        return (<Text style={{ padding: 16, fontSize: 18, color: '#fff', backgroundColor: 'black' }}>
            {this.state.albumName}
        </Text>
        )
    }

    render() {
        let { height, width } = Dimensions.get('window');

        const ImageURLs = this.state.photos.map(
            (img, index) => ({
                URI: img.src,
                id: String(index),
                thumbnail: img.src,
                
            })
        )
      
        return (

            <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>
                <Container style={{
                    justifyContent: 'center', flex: 1, marginTop: 20,
                    backgroundColor: 'transparent', flexDirection: 'column',
                    paddingTop: 10
                }}>

                    <Button style={{
                        width: width * 0.7, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', position: 'absolute',
                        top: 2, elevation: 8, borderWidth: 1, borderColor: '#fff', height: height * 0.8,
                        Color: 'transparent',marginBottom:30
                    }}
                        onPress={this.selectAnNewImage}
                        title={this.state.dataSaving? "Uploading your image":"+ Add a new image"}>

                    </Button>

                    <ImageBrowser style={{
                        position: 'absolute',
                        top: 2, alignSelf: 'center', 
                    }} 
                    images={ImageURLs}
                    topMargin = {30}/>


                </Container>
            </ImageBackground>
        );
    }




}
