import React from 'react';
import { View, SafeAreaView, Text, TextInput, StyleSheet, Keyboard, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native';

import User from '../User';

import firebase from 'firebase';
import { Button, Icon, Right, Header } from 'native-base'

import AsyncStorage from '@react-native-community/async-storage';


export default class ChatScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#1f5d64',
            },
            headerTitleStyle: {
                fontWeight: 'normal',
            },
            title: navigation.getParam('personName', null)
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            person: {
                name: props.navigation.getParam('personName'),
                phone: props.navigation.getParam('personPhone'),
                ownerPhone: props.navigation.getParam('ownerPhone')
            },
            textMessage: '',
            messageList: [],
            normalScreenHeight: 640,
            heightWhenKeyOpened: 340,
            tempHeight: 0,
            screenMultiple: 0.79
        }
        this.getHeightWhenKeyOpened()
        

    }

    getHeightWhenKeyOpened = async() => {
        console.warn("Height getting method started.");

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

    componentWillMount() {
     
        firebase.database().ref('messages').child(this.state.person.ownerPhone).child(this.state.person.phone)
            .on('child_added', (value) => {
                this.setState((prevState) => {
                    return {
                        messageList: [...prevState.messageList, value.val()]
                    }
                })
            })

    }

    handleChanges = key => val => {
        this.setState({ [key]: val })
    }

    convertTime = (item) => {
        let d = new Date(item);
        let c = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + " " + (d.getHours() < 12 ? 'AM' : 'PM');

        if (c.getDay() != d.getDay()) {
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result;

        }

        return result;
    }

    sendMessage = async () => {

        this.listView.scrollToEnd();

        if (this.state.textMessage.length > 0) {
            let msgId = firebase.database().ref('messages').child(User.phone).child(this.state.person.phone).push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }
            updates['messages/' + User.phone + '/' + this.state.person.phone + '/' + msgId] = message;
            updates['messages/' + this.state.person.phone + '/' + User.phone + '/' + msgId] = message;
            firebase.database().ref().update(updates);
            this.setState({ textMessage: '' });

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
            screenMultiple: 0.8
        })
    }

    _keyboardDidHide = () => {
        this.listView.scrollToEnd();

        this.setState({
            tempHeight: this.state.normalScreenHeight,
            screenMultiple: 0.79
        });
        //console.warn("Keyboard hide" + this.state.keyboardOpened);
    }

    renderRow = ({ item }) => {
        return (
            <View style={{
                flexDirection: 'row',
                width: '60%',
                paddingBottom: 2,
                paddingTop: 2,
                alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User.phone ? '#00897b' : '#7cb342',
                borderRadius: 5,
                marginBottom: 4
            }}>

                <Text multiline={true} style={{ color: '#fff', padding: 7, fontSize: 16 }}>
                    {item.message}
                </Text>
                <Right style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                }}>
                    <Text style={{ color: '#eee', fontSize: 11, marginRight: 5 }}>{this.convertTime(item.time)}</Text>
                </Right>
            </View>
        )
    }
    render() {
        
        return (
            <SafeAreaView >

                <FlatList
                   
                    style={{ marginTop: 2,paddingBottom: 30, paddingRight: 5, paddingLeft: 5, height: this.state.tempHeight * this.state.screenMultiple }}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                    ref={listView => { this.listView = listView; }}
                    />

              
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5 }}>
                        <TextInput
                            multiline={true}
                            placeholder="Type message..."
                            style={styles.input}
                            value={this.state.textMessage}
                            onChangeText={this.handleChanges('textMessage')} />

                        <Button style={{ width: 45, marginLeft: 5 }} onPress={this.sendMessage}></Button>


                    </View>

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
        fontSize: 16
    },
    btnText: {
        color: 'darkblue',
        fontSize: 20
    }

});