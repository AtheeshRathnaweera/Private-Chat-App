import React from 'react';
import { View, Platform, Button, Text, ActivityIndicator, StyleSheet, Modal, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Fab } from 'native-base';
import firebase from 'firebase';

import ImagePicker from 'react-native-image-picker';

import ImageBrowser from 'react-native-interactive-image-gallery';

import ImageResizer from 'react-native-image-resizer';

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

    addNewImageToAlbum = async (thumbUrl, url) => {

        let newImageId = firebase.database().ref('rooms/' + this.state.roomId + '/photos/' + this.state.albumId).push().key;
        let updates = {};

        imageData = {
            thumbnail: thumbUrl,
            src: url
        }

        firebase.database().ref('rooms/' + this.state.roomId + '/albums/' + this.state.albumId).update({
            Thumbnail: thumbUrl
        });

        updates['rooms/' + this.state.roomId + '/photos/' + this.state.albumId + "/" + newImageId] = imageData;
        firebase.database().ref().update(updates, function (error) {

            if (error) {
                Alert.alert("Image not added", "Unexpected error occured.");
                this.setState({
                    dataSaving: false
                })
            } else {
                //Image added successfully
               
              
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
                        numberOfPhotosInAlbum: this.state.photos.length,
                        dataSaving: false

                    }
                })

                this.setState({

                    loading: false,

                })

            })
    }

    uploadToFirebaseImage(type, uri, mime = 'application/privateChatApp') {
        this.setState({
            dataSaving:true
        })
        //Upload to firebase storage
        return new Promise((resolve, reject) => {

            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null
            let imageRef = ''

            if (type == 0) {
                
                //src
                imageRef = firebase.storage().ref('albumPhotos').child(this.state.albumId + (this.state.numberOfPhotosInAlbum + 1))
            } else {
                
                imageRef = firebase.storage().ref('albumPhotos').child("thumb" + this.state.albumId + (this.state.numberOfPhotosInAlbum + 1))
            }

           


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

    handlingUploading = async (thumbnailUri, OriginalUri) => {

        //console.warn("handlingUpload" + thumbnailUri + " " + OriginalUri)

        this.uploadToFirebaseImage(1, thumbnailUri)
            .then(thumbnailDownloadUrl => {
                //alert('uploaded ' + url); 

                this.uploadToFirebaseImage(0, OriginalUri)
                    .then(originalDownloadUrl => {
                        this.addNewImageToAlbum(thumbnailDownloadUrl, originalDownloadUrl);//Add the saved image url into the album

                    }).catch(error => this.setState({
                        dataSaving: false
                    }))

            })
            .catch(error => this.setState({
                dataSaving: false
            }))

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
                //const source = { uri: response.uri };


                //console.warn(" original size: "+response.fileSize)//500 500 80


                ImageResizer.createResizedImage(response.uri, 400, 400, "JPEG", 100, 0, null)
                    .then((thumbnailResponse) => {
                        //console.warn("resize image " + thumbnailResponse.uri + " ")

                        ImageResizer.createResizedImage(response.uri, 800, 900, "JPEG", 100, 0, null)
                        .then((originalResponse) => {
                            //console.warn("resize image " + originalResponse.uri + " ")

                            this.handlingUploading(thumbnailResponse.uri, originalResponse.uri).then(
                                result => {
                                    this.setState({
                                        dataSaving: false
                                    })
                                }
                            ).catch(
                                error =>
                                    this.setState({
                                        dataSaving: false
                                    })
                            )
                            
                            
                        }).catch((err) => {
                           // console.warn("Error occured while image resizing")
                           Alert.alert("Error occured","Image upload failed. Please try again later.")
                        });
                        

                    }).catch((err) => {
                        //console.warn("Error occured while image resizing")
                        Alert.alert("Error occured","Image upload failed. Please try again later.")
                    });

            }
        });
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
                thumbnail: img.thumbnail,
                title: "Image title "+String(index),
                description: 'This is the description'

            })
        )

        return (

            <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>
                <Container style={{
                    justifyContent: 'center', flex: 1, marginTop: 20,
                    backgroundColor: 'transparent', flexDirection: 'column',
                    paddingTop: 10
                }}>



                    <ImageBrowser 
                        images={ImageURLs}
                        closeText="Go back"


                    />

                    <Button style={{
                        width: width * 0.7, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', position: 'absolute',
                        top: 4, elevation: 8, borderWidth: 1, borderColor: '#fff', height: height * 0.8,
                        Color: 'transparent', marginBottom: 30
                    }}
                        onPress={this.selectAnNewImage}
                        title={this.state.dataSaving ? "Uploading your image..." : "+ Add a new image"}>

                    </Button>




                </Container>
            </ImageBackground>
        );
    }




}
