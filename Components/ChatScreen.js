import React from 'react';
import { View, SafeAreaView, Text, TextInput, StyleSheet, Keyboard, FlatList, ActivityIndicator, ImageBackground } from 'react-native';

import User from '../User';

import firebase from 'firebase';
import { Button, Icon, Right, Toast, Fab } from 'native-base'

import AsyncStorage from '@react-native-community/async-storage';




export default class ChatScreen extends React.Component {

    static navigationOptions = {
        header: null
    }

    // static navigationOptions = ({ navigation }) => {
    //     return {
    //        headerTintColor: '#fff',
    //       headerStyle: {
    //           backgroundColor: '#1f5d64',

    //       },
    //      headerTitleStyle: {
    //          fontWeight: 'normal',
    //      },
    //      title: navigation.getParam('personName', null),





    //   }
    //}

    constructor(props) {
        super(props);
        this.state = {
            roomId: '',
            person: {
                name: props.navigation.getParam('personName'),
                phone: props.navigation.getParam('personPhone'),
                ownerPhone: props.navigation.getParam('ownerPhone')
            },
            textMessage: '',
            messageList: [],
            normalScreenHeight: 640,
            heightWhenKeyOpened: 340,
            tempHeight: 600,
            screenMultiple: 0.79,
            newMessage: false,
            loading: true,


        }
        this.getHeightWhenKeyOpened()


    }

    getHeightWhenKeyOpened = async () => {

        const normalHeight = await AsyncStorage.getItem('normalScreenHeight');
        const heightWhenKey = await AsyncStorage.getItem('heightWhenKeyOpened');

        this.setState({
            normalScreenHeight: normalHeight,
            heightWhenKeyOpened: heightWhenKey,
            tempHeight: normalHeight

        })


    }

    componentDidMount() {





        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );




    }

    async componentWillMount() {
        const roomID = await AsyncStorage.getItem('roomId');
        this.setState({
            roomId: roomID
        })

        firebase.database().ref('rooms/' + roomID + '/chat')
            .on('child_added', (value) => {

                this.setState((prevState) => {

                    return {
                        messageList: [...prevState.messageList, value.val()]
                    }
                })

                this.setState({

                    loading: false
                })

                try {
                    this.listView.scrollToEnd()

                } catch (e) {

                }


            })

    }

    handleChanges = key => val => {
        this.setState({ [key]: val })
    }

    convertTime = (item) => {
        let d = new Date(item);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + " " + (d.getHours() < 12 ? 'AM' : 'PM')

        return result;

    }

    getDateFromItem = (item) => {

        let d = new Date(item);
        let result = d.getDate() + " " + d.getMonth() + 1 + " " + d.getFullYear();
        this.setState({
            dateAdded: true
        })

        return result

    }

    sendMessage = async () => {

        if (this.state.textMessage.length > 0) {

            let msgId = firebase.database().ref('rooms/' + this.state.roomId + '/chat').push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: this.state.person.ownerPhone
            }
            updates['rooms/' + this.state.roomId + '/chat/' + msgId] = message;
            firebase.database().ref().update(updates, function (error) {

                if (error) {
                    Alert.alert("Message not sent", "Unexpected error occured.");
                } else {

                    this.listView.scrollToEnd();

                }
            }.bind(this)
            );

            this.setState({
                textMessage: ''

            });


        } else {
            this.listView.scrollToEnd();

        }



    }


    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (e) => {
        this.listView.scrollToEnd();


        //console.warn("Keyboard show " + this.state.keyboardOpened + " " + shortHeight + " normal: " + normalHeight + " " + keyboardHeight);

        this.setState({
            tempHeight: this.state.heightWhenKeyOpened,
            screenMultiple: 0.9
        })


    }

    _keyboardDidHide = () => {
        // this.listView.scrollToEnd();

        this.setState({
            tempHeight: this.state.normalScreenHeight,
            screenMultiple: 0.75
        });
        //console.warn("Keyboard hide" + this.state.keyboardOpened);
    }

    goToTheBottom = () => {
        this.state.newMessage ? this.listView.scrollToEnd() : null;
    }

    renderRow = ({ item }) => {
        return (
            <View style={{
                flexDirection: 'row',
                width: '60%',
                paddingBottom: 2,
                paddingTop: 2,
                alignSelf: item.from === this.state.person.ownerPhone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === this.state.person.ownerPhone ? '#669900' : '#fff',
                borderRadius: 5,
                marginBottom: 6,
                elevation: 5
            }}>
                
                <Text multiline={true} style={{ color: item.from === this.state.person.ownerPhone ? '#fff' : '#505050', padding: 7, fontSize: 15, width: '74%' }}>
                    {item.message}
                </Text>
                <Right style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    width: '24%'
                }}>
                    <Text style={{ color: item.from === this.state.person.ownerPhone ? '#fff' : '#505050', fontSize: 11, marginRight: 5 }}>{this.convertTime(item.time)}</Text>
                </Right>
            </View>
        )
    }

    render() {

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'column' }}>

                <ImageBackground source={require('../images/backOne.jpg')} style={{ width: '100%', height: '100%' }}>


                    {this.state.loading ? <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} /> : null}

                    <FlatList

                        style={{
                            marginTop: 37, paddingRight: 5, paddingLeft: 5,
                            height: this.state.tempHeight * this.state.screenMultiple, backgroundColor: 'transparent'
                        }}
                        data={this.state.messageList}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        ref={listView => { this.listView = listView; }}
                        showsVerticalScrollIndicator={false}


                    />



                    <View style={{
                        flexDirection: 'row', paddingBottom: 5, alignItems: 'center',
                        marginHorizontal: 5, justifyContent: 'center', backgroundColor: 'transparent'
                    }}>


                        <TextInput
                            multiline={true}
                            placeholder="Type message..."
                            style={styles.input}
                            value={this.state.textMessage}
                            onChangeText={this.handleChanges('textMessage')}

                        />

                        <Button style={{
                            width: '15%', height: '95%', marginLeft: 5, marginRight: 5, justifyContent: 'center', borderRadius: 30,
                            alignContent: 'center', backgroundColor: '#1f5d64', alignItems: 'center', elevation: 5
                        }} onPress={this.sendMessage}>

                            <Icon name='md-send' style={{ color: '#fff' }} />
                        </Button>




                    </View>

                </ImageBackground>
            </SafeAreaView>



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
        paddingLeft: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '85%',
        borderRadius: 5,
        fontSize: 15,
        marginLeft: 5,
        backgroundColor: '#fff'
    },
    btnText: {
        color: 'darkblue',
        fontSize: 20
    }

});