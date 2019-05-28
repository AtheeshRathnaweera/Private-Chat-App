import React from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet, Modal, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Card, Button, Thumbnail, CardItem, Right, Icon, Left, Body } from 'native-base';
import firebase from 'firebase';

import PhotoGrid from 'react-native-image-grid';


export default class ViewPhoto extends React.Component {

    static navigationOptions = {

        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            roomId: '',
            albumId: props.navigation.getParam('albumId'),
            photos: [],
            photoUrl: '',
            loading: true,
            ModalVisibleStatus: false
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

    render() {

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
                        <Image>
                    </View>

                </Modal>
            )
        }

        let { height, width } = Dimensions.get('window');

        return (

            <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>


                <Container style={{
                    flex: 1, backgroundColor: 'transparent', alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>

                    <Button transparent style={{
                        width: width * 0.9, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', position: 'absolute',
                        top: 0, elevation: 8, marginTop: 40, borderWidth: 1, borderColor: '#fff', margin: 10
                    }}
                        onPress={() => this.props.navigation.navigate('createANewAlbum')}>
                        <Text style={{ color: '#fff', fontSize: 17 }}> +  Add a photo</Text>
                    </Button>



                    <FlatList

                        style={{
                            marginTop: 13, position: 'absolute', bottom: 0, marginBottom: 5,
                            height: height * 0.85, backgroundColor: 'transparent'
                        }}
                        data={this.state.albumList}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ref={listView => { this.listView = listView; }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={this.renderEmptyContainer()}
                    />
                </Container>

            </ImageBackground>



        )
    }

}
