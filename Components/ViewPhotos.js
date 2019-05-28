import React from 'react';
import { View, YellowBox, Text, ActivityIndicator, StyleSheet, Modal, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Card, Button, Thumbnail, CardItem, Right, Icon, Left, Body } from 'native-base';
import firebase from 'firebase';

import PhotoGrid from 'react-native-image-grid';
import ImagePicker from 'react-native-image-picker';

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
            ModalVisibleStatus: false
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



    async componentWillMount() {

        const roomID = await AsyncStorage.getItem('roomId');

        this.setState({
            roomId: roomID
        })

        console.warn(this.state.albumId)

        firebase.database().ref('rooms/' + roomID + '/albums/' + this.state.albumId + '/photos')
            .on('child_added', (value) => {

                this.setState((prevState) => {

                    return {
                        photos: [...prevState.photos, value.val()]
                    }
                })

                this.setState({

                    loading: false
                })


            })
    }

    uploadAnImage() {

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

               console.warn(response.uri)
            }
        });
    }



    ShowModalFunction(visible, imageUrl) {
        //Hnadle the click on image or grid
        this.setState(
            {
                ModalVisibleStatus: visible,
                photoUrl: imageUrl
            }
        )

    }

    renderItem = ({ item, itemSize, itemPaddingHorizontal }) => {
        //single item of the grid
        //src + title 
        let { height, width } = Dimensions.get('window');

        return (

            <TouchableOpacity
                style={{
                    width: itemSize,
                    height: itemSize,
                    paddingHorizontal: itemPaddingHorizontal
                }}
                onPress={() => { this.ShowModalFunction(true, item.src) }}>

                <Image
                    resizeMethod="cover"
                    style={{ flex: 1 }}
                    source={{ uri: item.src }} />

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

        if (this.state.ModalVisibleStatus) {
            //Modal to show the full image with close button
            return (
                <Modal
                    transparent={false}
                    animationType={'fade'}
                    visible={this.state.ModalVisibleStatus}
                    onRequestClose={() => {
                        this.ShowModalFunction(!this.state.ModalVisibleStatus, '')
                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>

                        <Image style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '98%', resizeMode: 'contain' }}
                            source={{ uri: this.state.photoUrl }} />

                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={{
                                width: 25,
                                height: 25,
                                top: 9,
                                right: 9,
                                position: 'absolute'
                            }}
                            onPress={() => {
                                this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
                            }}>

                            <Image
                                source={{ uri: 'https://aboutreact.com/wp-content/uploads/2018/09/close.png', }}
                                style={{ width: 25, height: 25, marginTop: 16 }}
                            />

                        </TouchableOpacity>

                    </View>

                </Modal>
            )
        } else {
            //Photo Grid of images
            return (
                <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>
                    <View style={{
                        justifyContent: 'center', flex: 1, marginTop: 20,
                        backgroundColor: 'transparent', flexDirection: 'column'
                    }}>

                        <Button transparent style={{
                            width: width * 0.9, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', position: 'absolute',
                            top: 0, elevation: 8, marginTop: 30, borderWidth: 1, borderColor: '#fff', margin: 10
                        }}
                            onPress={console.warn("add a new photo button clicked")}>
                            <Text style={{ color: '#fff', fontSize: 17 }}> +  Add a new photo </Text>
                        </Button>

                        <PhotoGrid
                            style={{
                                marginTop: 13, position: 'absolute', bottom: 0, marginBottom: 5,
                                height: height * 0.85, backgroundColor: 'transparent'
                            }}
                            data={this.state.photos}
                            itemsPerRow={3}
                            //You can decide the item per row
                            itemMargin={1}
                            itemPaddingHorizontal={1}

                            renderItem={this.renderItem.bind(this)}
                        />
                    </View>
                </ImageBackground>
            );
        }


    }

}
