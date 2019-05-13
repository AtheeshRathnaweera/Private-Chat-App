import React from 'react';
import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, FlatList, Dimensions, KeyboardAvoidingView } from 'react-native';

import User from '../User';

import firebase from 'firebase';

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
            title: navigation.getParam('name', null)
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            person: {
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone')
            },
            textMessage: '',
            messageList: []
        }

    }

    componentWillMount() {
        firebase.database().ref('messages').child(User.phone).child(this.state.person.phone)
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

    renderRow = ({ item }) => {
        return (
            <View style={{
                flexDirection: 'row',
                width: '60%',
                alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User.phone ? '#00897b' : '#7cb342',
                borderRadius: 5,
                marginBottom: 10
            }}>

                <Text style={{ color: '#fff', padding: 7, fontSize: 16 }}>
                    {item.message}
                </Text>
                <Text style={{ color: '#eee', padding: 3, fontSize: 11 }}>{this.convertTime(item.time)}</Text>
            </View>
        )
    }
    render() {
        let { height, width } = Dimensions.get('window');
        return (
            <SafeAreaView>


                <FlatList
                    inverted

                    style={{ padding: 10, height: height * 0.8 }}
                    data={this.state.messageList}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()} />

                <KeyboardAvoidingView behavior="padding" enabled>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 5, height: height * 0.1 }}>


                        <TextInput
                            placeholder="Type message..."
                            style={styles.input}
                            value={this.state.textMessage}
                            onChangeText={this.handleChanges('textMessage')} />

                        <TouchableOpacity onPress={this.sendMessage} style={{ paddingBottom: 10, marginLeft: 5 }}>
                            <Text style={styles.btnText}>Send</Text>

                        </TouchableOpacity>

                    </View>

                </KeyboardAvoidingView>
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
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '80%',
        marginBottom: 7,
        borderRadius: 5
    },
    btnText: {
        color: 'darkblue',
        fontSize: 20
    }

});