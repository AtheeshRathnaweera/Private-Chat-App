import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';

import User from '../User';

import firebase from 'firebase';

import { YellowBox } from 'react-native';
import _ from 'lodash';

import { Container, Header, Content, Body, Left, Right, Button, Icon, Title, Thumbnail } from 'native-base';

export default class HomeScreen extends React.Component {

    //  static navigationOptions = {
    //    header: null
    //   }
    static navigationOptions = ({ navigation }) => {

        let c = new Date();
        let result = '';
        let time = c.getHours();

        if (time < 4) {
            result = " Devils are awake now ! "
        } else if (time < 11) {
            result = " Good Morning ! "
        } else if (time < 14) {
            result = " It's so hot outside!"
        } else if (time < 19) {
            result = " Good Evening !"
        } else if (time < 23) {
            result = " Time to chill with moon !"
        } else if (time < 24) {
            result = " Time to sleep !"
        }

        return {
            title: result,
            headerTitleStyle: {
                fontWeight: 'normal',
                color: '#fff',
            },

            headerStyle: {
                backgroundColor: '#1f5d64',
                color: '#fff'
            },

            headerRight:
                <Button transparent onPress={() => navigation.navigate('userProfile')} style={{ alignSelf: 'center' }}>
                    <Icon name='settings' style={{ color: '#fff' }} />
                </Button>
        }
    }

    state = {
        users: [],
        partnerPhone: ''
    }



    checkPartnerExistency = (partnersPhoneNumber) => {
        //Check if any users exist
        firebase.database().ref('users').limitToFirst(1).once(partnersPhoneNumber, snapshot => {
            if (snapshot.exists()) {
                console.warn("exists!");
                // TODO: Handle that users do exist
                return true;
            } else {
                console.warn("Not exists!");
            }

            // TODO: Handle that users do not exist
        });

    }

    getPartnerNum = async () => {
        try {
          const phone = await AsyncStorage.getItem('userPhone');

          if(phone !== null) {
            this.setState( { partnerPhone: "qvhbw"} );
            console.warn("Done . Data found");
            // value previously stored
          }
        } catch(e) {
            console.warn("Error "+e.message);
          // error reading value
        }
      }

   

    async componentWillMount() {

        YellowBox.ignoreWarnings(['Setting a timer']);
        const _console = _.clone(console);
        console.warn = message => {
            if (message.indexOf('Setting a timer') <= -1) {
                _console.warn(message);
            }
        };

        await this.getPartnerNum();


        //let dbRef = firebase.database().ref('users');
        //dbRef.on('child_added', (val) => {
        //   let person = val.val();
        //  person.phone = val.key;

        //  if (person.phone === User.phone) {
        //       User.name = person.name
        //   } else {
        //      this.setState((prevState) => {
        //         return {
        //              users: [...prevState.users, person]
        //         }
        //      })
        //  }
        // })
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

    //<TouchableOpacity onPress={() => navigation.navigate('userProfile')} >
    // <Image source={require('../images/bunny.png')} style={{ width: 35, height: 30, marginRight: 7 }} />
    //</TouchableOpacity>

    //<Text>{User.phone}</Text>
    //<TouchableOpacity onPress={this._logOut}>
    //   <Text>LogOut</Text>
    //</TouchableOpacity>

    //<View >
    //   <FlatList
    //   data={this.state.users}
    //  renderItem={this.renderRow}
    //  keyExtractor={(item) => item.phone}
    //  style={{ marginTop: 10  }} />
    //</View>
    //<Image source={require('../images/me.jpg')} style={styles.profileImg} />

    //() => this.props.navigation.navigate('chatScreen', item)

    render() {
        let { height, width } = Dimensions.get('window');
        return (

            <Container style={{ flex: 1, backgroundColor: '#1f5d64', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>


                <Content contentContainerStyle={{ alignItems: 'center' }}  >

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('chatScreen', item) }
                        style={[styles.profileImgContainer, { borderColor: '#fff', borderWidth: 1 }]}

                        
                    >

                        <Thumbnail large source={require('../images/me.jpg')} style={styles.profileImg} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, color: '#fff', marginTop: 10, fontStyle: 'italic' }}>atheesh27</Text>






                </Content>

            </Container>


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
    },
    profileImgContainer: {
        height: 120,
        width: 120,
        borderRadius: 60,
        overflow: 'hidden'
    },
    profileImg: {
        height: 120,
        width: 120
    },
});