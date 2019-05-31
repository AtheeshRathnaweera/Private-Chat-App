import React from 'react';
import { View, FlatList, Text, Platform, StyleSheet, TextInput, Alert, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Card, Button, Thumbnail, CardItem, Right, Icon, Left, Body } from 'native-base';
import firebase from 'firebase';


export default class UpdateAAlbum extends React.Component {

    static navigationOptions = {

        header: null
    }


    constructor(props) {
        super(props);
        this.state = {
            roomId: props.navigation.getParam('roomID'),
            albumId: props.navigation.getParam('albumId'),
            albumName: props.navigation.getParam('albumName'),
            photos: [],
            loading: false

        }
    }

    async componentWillMount() {

        firebase.database().ref('rooms/' + this.state.roomId + '/photos/' + this.state.albumId)
            .on('child_added', (value) => {

                this.setState((prevState) => {

                    return {

                        photos: [...prevState.photos, value.val()],
                        //numberOfPhotosInAlbum: this.state.photos.length

                    }
                })

                this.setState({

                    loading: false,

                })

            })
    }

    deleteAPhoto(){
        console.warn("Delete a photo")
        Alert.alert("Remove the photo")
    }


    getTheDateString() {
        const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const timeNow = new Date();

        var date = timeNow.getDate();
        var month = timeNow.getMonth();
        var year = timeNow.getFullYear();

        if (date < 10) {
            date = "0" + date
        }

        const dateString = date + " " + monthList[month] + " , " + year

        return dateString

    }

    renderRow = ({ item }) => {
        let { height, width } = Dimensions.get('window');

        return (

            <Card transparent style={{
                flexDirection: 'row', width: width * 0.9, borderBottomWidth: 0.5,
                marginTop: 5, borderBottomColor: 'white', paddingBottom: 5
            }}>

                <Thumbnail square large source={{ uri: item.src }} />

                <View style={{ flexDirection: 'column', marginStart: 10 }}>
                    <Text style={{ fontSize: 17, color: 'white' }}> Item name</Text>
                    <Text style={{ fontSize: 13, color: 'white' }}> Item descrip</Text>

                </View>

                <Right>
                    <Button transparent onPress={this.deleteAPhoto}>
                    <Icon small name='ios-remove-circle' style={{ color: '#fff' }} />
                    </Button>
                </Right>


            </Card>


        )
    }


    deleteTheAlbum() {
        console.warn("delete the album method")



    }

    renderEmptyContainer() {
        let { height, width } = Dimensions.get('window');

        return (
            <View style={{ height: height * 0.8, justifyContent: 'center', alignContent: 'center' }}>

                <Text style={{ color: '#fff' }}>No photos to show</Text>

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
                    justifyContent: 'center',
                    alignContent: 'center'
                }}>

                    <View style={{
                        flexDirection: 'column', position: 'absolute', top: 0, marginTop: 35, flex: 1,
                        alignContent: 'center', justifyContent: 'center'
                    }}>

                        <TextInput
                            placeholder={'Change the album name'}
                            placeholderTextColor='#fff'
                            style={{
                                width: width * 0.9, backgroundColor: 'transparent', color: '#fff',
                                borderRadius: 15, borderWidth: 1, borderColor: '#fff',

                            }}
                            value={this.state.albumName}
                            onChangeText={(text) => this.setState({ albumName: text })}
                        />

                        <View style={{ flexDirection: "row" }}>

                            <Button rounded
                                style={{
                                    width: width * 0.4, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', elevation: 8,
                                    marginTop: 10, backgroundColor: '#A9A9A9', marginRight: 10
                                }}
                                onPress={this.saveTheNewAlbum}>
                                <Text style={{ color: '#fff', fontSize: 17 }}> Save changes </Text>
                            </Button>

                            <Button rounded
                                style={{
                                    width: width * 0.5, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', elevation: 8,
                                    marginTop: 10, backgroundColor: 'red'
                                }}
                                onPress={this.deleteTheAlbum}>
                                <Text style={{ color: 'white', fontSize: 17 }}> Delete the album </Text>
                            </Button>

                        </View>

                    </View>

                    <FlatList

                        style={{

                            marginTop: 16, position: 'absolute', bottom: 0, marginBottom: 5,
                            backgroundColor: 'transparent', height: height * 0.75
                        }}

                        data={this.state.photos}
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
