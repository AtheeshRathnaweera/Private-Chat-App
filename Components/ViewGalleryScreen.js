import React from 'react';
import { View, FlatList, Text, Platform, StyleSheet, TextInput, Alert, TouchableOpacity, Dimensions, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../User';

import { Container, Card, Button, Thumbnail, CardItem, Right, Icon, Left, Body } from 'native-base';
import firebase from 'firebase';

export default class ViewGalleryScreen extends React.Component {

    static navigationOptions = {

        header: null
    }

    state = {
        messageList: ["first"]
    }

    renderRow = ({ item }) => {
        let { height, width } = Dimensions.get('window');

        return (
            <Card style={{ width: width * 0.9 }}>

            <CardItem cardBody>
                <Image source={{ uri: 'https://anthonypeoples.files.wordpress.com/2013/11/eminem.jpg' }} style={{ height: 200, width: null, flex: 1 }} />
            </CardItem>
            <CardItem style={{ alignContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>

                <Text style={{ fontSize: 15 }}>Album name</Text>
                <Text style={{ fontSize: 12 }}>Created date</Text>

            </CardItem>
        </Card>
        )
    }

    renderEmptyContainer(){
        let { height, width } = Dimensions.get('window');

        return (
            <View style ={{height: height*0.8, justifyContent: 'center',alignContent: 'center'}}>
                <Text style={{color: '#fff'}}>No albums to show</Text>

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
                        top: 0, elevation: 8, marginTop: 40, borderWidth: 1, borderColor: '#fff', margin: 10
                    }}
                    onPress={() => this.props.navigation.navigate('createANewAlbum')}>
                        <Text style={{ color: '#fff', fontSize: 17 }}> +  Create a new album </Text>
                    </Button>

                    <FlatList

                        style={{
                            marginTop: 13, position: 'absolute',bottom:0,marginBottom:5,
                            height: height*0.85, backgroundColor: 'transparent'
                        }}
                        data={this.state.messageList}
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
