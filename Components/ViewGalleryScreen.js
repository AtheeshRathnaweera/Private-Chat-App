import React from 'react';
import { View, FlatList, Text, YellowBox, StyleSheet, TextInput, Alert, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Card, Button, Thumbnail, CardItem, Right, Icon, Left, Body } from 'native-base';
import firebase from 'firebase';
import { TouchableHighlight } from 'react-native-gesture-handler';

import _ from 'lodash';


export default class ViewGalleryScreen extends React.Component {

    static navigationOptions = {

        header: null
    }

    state = {
        roomId: '',
        albumList: [],
        albumName: '',
        loading: true
    }

    async componentWillMount() {

        YellowBox.ignoreWarnings(['Setting a timer']);
        const _console = _.clone(console);
        console.warn = message => {
            if (message.indexOf('Setting a timer') <= -1) {
                _console.warn(message);
            }
        };

        const roomID = await AsyncStorage.getItem('roomId');

        this.setState({
            roomId: roomID
        })

        firebase.database().ref('rooms/' + roomID + '/albums')
            .on('child_added', (value) => {

                this.setState((prevState) => {

                    return {
                        albumList: [...prevState.albumList, value.val()]
                    }
                })

                this.setState({

                    loading: false
                })


            })
    }

    cardClick() {
        console.warn("Card clicked")
    }

    renderRow = ({ item }) => {
        let { height, width } = Dimensions.get('window');

        return (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('viewPhotos', {
                'albumId': item.albumId,
                'albumName': item.name
            })} activeOpacity={1}>
                <Card style={{ width: width * 0.9 }}
                >

                    <CardItem cardBody>
                        <Image source={{ uri: item.Thumbnail }} style={{ height: 200, width: null, flex: 1 }} />
                    </CardItem>
                    <CardItem style={{ alignContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>

                        <Text style={{ fontSize: 17 }}>{item.name}</Text>
                        <Text style={{ fontSize: 12 }}>{item.createdDate}</Text>

                    </CardItem>
                </Card>

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
                        top: 0, elevation: 8, marginTop: 30, borderWidth: 1, borderColor: '#fff', margin: 10
                    }}
                        onPress={() => this.props.navigation.navigate('createANewAlbum')}>
                        <Text style={{ color: '#fff', fontSize: 17 }}> +  Create a new album </Text>
                    </Button>



                    <FlatList

                        style={{
                            marginTop: 16, position: 'absolute', bottom: 0, marginBottom: 5,
                            height: height * 0.85, backgroundColor: 'transparent'
                        }}
                        
                        data={this.state.albumList}
                        renderItem={this.renderRow}
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
