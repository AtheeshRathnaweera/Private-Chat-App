import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator,Image } from 'react-native';

import User from '../User';

import firebase from 'firebase';

import { YellowBox, SafeAreaView } from 'react-native';
import _ from 'lodash';

import { Container, Header, Content, Button, Icon, Title, Thumbnail, Footer, Card } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

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
                    <Icon name='person' style={{ color: '#fff' }} />
                </Button>
        }
    }

    state = {
        users: [],
        ownerPhone: '',
        partUserName: 'user not found',
        partnerPhone: 'partner not found',
        partnerStatus: 'No status',
        partnerImgUrl: 'https://image.flaticon.com/icons/png/512/149/149074.png',
        loading: true
    }



    checkPartnerExistency = (partnersPhoneNumber) => {
        //Check if any users exist
        firebase.database().ref('users').limitToFirst(1).once(partnersPhoneNumber, snapshot => {
            if (snapshot.exists()) {
               // console.warn("exists!");
                // TODO: Handle that users do exist
                return true;
            } else {
               // console.warn("Not exists!");
                return false;
            }

            // TODO: Handle that users do not exist
        });

    }


    async componentWillMount() {

        YellowBox.ignoreWarnings(['Setting a timer']);
        const _console = _.clone(console);
        console.warn = message => {
            if (message.indexOf('Setting a timer') <= -1) {
                _console.warn(message);
            }
        };

        //  await this.getPartnerNum();
        try {

            const foundPartPhone = await AsyncStorage.getItem('partnerPhone');
            const userPhone = await AsyncStorage.getItem('userPhone');

          

            if (foundPartPhone !== null) {
                //console.warn("Done . Data found" + foundPartPhone);

                firebase.database().ref('users/' + foundPartPhone + '/User').once('value').then(snap => {

                    if (snap.exists()) {

                        let stringifyObject = JSON.stringify(snap)
                        let obj = JSON.parse(stringifyObject);
                        obj.key = snap.key
                        const partName = JSON.stringify(obj.name);
                        const partStatus = JSON.stringify(obj.status);

                        const partImgUr = JSON.stringify(obj.imageUrl);

                    
                        const formattedName = partName.replace(/^"(.*)"$/, '$1');
                        const formattedUri = partImgUr.replace(/^"(.*)"$/, '$1');

                        //console.warn("This is the uri:   "+formattedUri);

                        this.setState({
                            ownerPhone: userPhone,
                            partUserName: formattedName,
                            partnerPhone: foundPartPhone,
                            partnerStatus: partStatus,
                            partnerImgUrl: formattedUri,
                            loading: false

                        });

                    


                        // TODO: Handle that users do exist

                    } else {
                        console.warn("Not exists!");
                    }

                    // TODO: Handle that users do not exist
                });


            } else {
                console.warn("Not. Data Not found");
            }

        } catch (e) {
            console.warn("Error " + e.message);
            // error reading value
        }

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
        const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
        return (

            <Container style={{ flex: 1, backgroundColor: '#1f5d64', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>

                <Content contentContainerStyle={{ alignItems: 'center', padding: 12 }}  >


                    <TouchableOpacity
                        // onPress={() => this.props.navigation.navigate('chatScreen', item)}
                        //source={{ uri: this.state.partnerImgUrl}}
                        style={[styles.profileImgContainer, { borderColor: '#fff', borderWidth: 1, marginTop: 10 }]}>

                        <Image large style={styles.profileImg}  source={{uri : this.state.partnerImgUrl }}/>

                    </TouchableOpacity>

                    <Text style={{ fontSize: 22, color: '#fff', marginTop: 10, fontStyle: 'italic' }}>{this.state.partUserName}</Text>

                    <Text style={{ fontSize: 13, color: '#fff' }}>{this.state.partnerPhone}</Text>

                    <Text style={{ fontSize: 13, color: '#fff' }}>{this.state.partnerStatus}</Text>

                    <Button rounded
                        style={{
                            width: width * 0.9, justifyContent: 'center', alignSelf: 'center',
                            marginTop: 15, backgroundColor: '#DAA520', elevation: 6
                        }}
                        onPress={() => this.props.navigation.navigate('chatScreen', {
                            'personPhone': this.state.partnerPhone,
                            'personName': this.state.partUserName,
                            'ownerPhone': this.state.ownerPhone
                        })}>




                        {this.state.loading ? <ActivityIndicator size="small" color="#fff" /> : null}
                        {this.state.loading ? null : <Text style={{ color: '#F5FCFF', fontSize: 16 }}>Open conversation</Text>}

                    </Button>


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