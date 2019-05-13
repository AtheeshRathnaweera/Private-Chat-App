import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Image } from 'react-native';

import User from '../User';

import firebase from 'firebase';
export default class HomeScreen extends React.Component {

    static navigationOptions = ({navigation}) => {
        return{
            title: 'Chats',
            headerRight: (
                <TouchableOpacity onPress={()=>navigation.navigate('userProfile')}>
                        <Image source={require('../images/bunny.png')}style={{width: 32, height:32, marginRight:7}}/>
                </TouchableOpacity>
            )
        }
        
    }

    state = {
        users: []
    }

    componentWillMount() {
        let dbRef = firebase.database().ref('users');
        dbRef.on('child_added', (val) => {
            let person = val.val();
            person.phone = val.key;

            if (person.phone === User.phone) {
                User.name = person.name
            } else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })
    }

   
    renderRow = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('chatScreen', item)}
                style={{ padding: 10, borderColor: '#ccc', borderWidth: 1 }}>
                <Text style={{ fontSize: 19 }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    //<Text>{User.phone}</Text>
    //<TouchableOpacity onPress={this._logOut}>
    //   <Text>LogOut</Text>
    //</TouchableOpacity>

    render() {
        return (
            <View >


                <FlatList
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.phone}
                    style={{ marginTop: 10 }} />
            </View>

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
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '90%',
        marginBottom: 7,
        borderRadius: 5
    }
});