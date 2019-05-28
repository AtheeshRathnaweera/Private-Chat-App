import React from 'react';
import { Alert,View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Image, ImageBackground } from 'react-native';

import firebase from 'firebase';

import { YellowBox, SafeAreaView } from 'react-native';
import _ from 'lodash';

import { Container, Header, Content, Button, Right, Icon, Thumbnail, Footer, Card } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

export default class HomeScreen extends React.Component {

    static navigationOptions = {
        header: null
    }
  

    state = {
        users: [],
        roomid: '',
        ownerPhone: '',
        ownerName: 'Not found',
        partUserName: 'user not found',
        partnerPhone: 'partner not found',
        partnerStatus: 'No status',
        userImageUrl: 'https://image.flaticon.com/icons/png/512/149/149074.png',
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

    getDataFromAsyncStorage = async () => {

        const roomID = await AsyncStorage.getItem('roomId');
        const userName = await AsyncStorage.getItem('userName');
        const userPhone = await AsyncStorage.getItem('userPhone');
        const userImage = await AsyncStorage.getItem('userImageUrl');

        const partnerPhone = await AsyncStorage.getItem('partnerPhone');


        this.setState({
            roomid: roomID,
            ownerPhone: userPhone,
            ownerName: userName,
            userImageUrl: userImage,
            partnerPhone: partnerPhone

        })
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

            this.getDataFromAsyncStorage().then(result => {

                firebase.database().ref('rooms/' + this.state.roomid + '/' + this.state.partnerPhone).once('value', function (snap) {
                    if (snap.exists()) {


                        let stringifyObject = JSON.stringify(snap)
                        let obj = JSON.parse(stringifyObject);
                        obj.key = snap.key

                        const partName = JSON.stringify(obj.name);
                        const partStatus = JSON.stringify(obj.status);
                        const partImageUrl = JSON.stringify(obj.imageUrl);

                        const formattedPartName = partName.replace(/^"(.*)"$/, '$1');
                        const formattedPartUri = partImageUrl.replace(/^"(.*)"$/, '$1');
                        const formattedPartStatus = partStatus.replace(/^"(.*)"$/, '$1');

                        this.setState({

                            partUserName: formattedPartName,
                            partnerStatus: formattedPartStatus,
                            partnerImgUrl: formattedPartUri,
                            loading: false

                        })

                    } else {
                        Alert.alert("User not found", "Partner not found.");
                    }
                }.bind(this))

            }).catch(error => {
                Alert.alert("Unexpected error occured", "Please try again.");
            })


        } catch (e) {
            Alert.alert("Unexpected error occured", "Please try again.");
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

            <ImageBackground source={require('../images/starback.jpg')} style={{ flex: 1, width: null, height: null }}>

                <View style={{ flex: 1, backgroundColor: 'transparent', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>

                    <Header transparent>

                        <Right>
                            <Button transparent onPress={() => navigation.navigate('userProfile')} style={{ alignSelf: 'center' }}>
                                <Icon name='person' style={{ color: '#fff' }} />
                            </Button>
                        </Right>
                    </Header>


                    <View style={{ flexDirection: 'row', marginRight: 45, marginLeft: 45 }} >

                        <Content contentContainerStyle={{ alignItems: 'center', marginBottom:40 }}  >

                            <TouchableOpacity
                                // onPress={() => this.props.navigation.navigate('chatScreen', item)}
                                //source={{ uri: this.state.partnerImgUrl}}
                                style={[styles.profileImgContainer, { borderColor: '#fff', borderWidth: 1, elevation: 10 }]}>

                                <Image large style={styles.profileImg} source={{ uri: this.state.userImageUrl }} />

                            </TouchableOpacity>

                            <Text style={{ fontSize: 18, color: '#fff', marginTop: 10, fontStyle: 'italic' }}>{this.state.ownerName}</Text>

                            <Text style={{ fontSize: 12, color: '#fff' }}>{this.state.ownerPhone}</Text>

                        </Content>

                        <Content contentContainerStyle={{ alignItems: 'center' }}  >


                            <TouchableOpacity
                                // onPress={() => this.props.navigation.navigate('chatScreen', item)}
                                //source={{ uri: this.state.partnerImgUrl}}
                                style={[styles.profileImgContainer, { borderColor: '#fff', borderWidth: 1, elevation: 10 }]}>

                                <Image large style={styles.profileImg} source={{ uri: this.state.partnerImgUrl }} />

                            </TouchableOpacity>

                            <Text style={{ fontSize: 18, color: '#fff', marginTop: 10, fontStyle: 'italic' }}>{this.state.partUserName}</Text>

                            <Text style={{ fontSize: 12, color: '#fff' }}>{this.state.partnerPhone}</Text>

                        </Content>

                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 30, position: 'absolute', bottom: 0 }}>

                        <Button transparent onPress={() => this.props.navigation.navigate('chatScreen', {
                            'personPhone': this.state.partnerPhone,
                            'personName': this.state.partUserName,
                            'ownerPhone': this.state.ownerPhone
                        })}
                            style={{
                                alignSelf: 'center', alignItems: 'center',
                                borderWidth: 1, borderColor: '#fff', borderRadius: 60, paddingLeft: 2, paddingTop: 24, paddingBottom: 24, paddingRight: 2, marginRight: 20
                            }}>

                            {this.state.loading ? <ActivityIndicator style={{ width: 40 }} size="small" color="#fff" /> : null}
                            {this.state.loading ? null : <Icon large name='md-phone-portrait' style={{ color: '#fff' }} />}

                        </Button>

                        <Button transparent onPress={() => this.props.navigation.navigate('viewGallery')} style={{
                            alignSelf: 'center',
                            alignItems: 'center', borderWidth: 1, borderColor: '#fff', borderRadius: 60, paddingTop: 25, paddingBottom: 25, marginRight: 20
                        }}>
                            {this.state.loading ? <ActivityIndicator style={{ width: 43 }} size="small" color="#fff" /> : null}
                            {this.state.loading ? null : <Icon large name='md-photos' style={{ color: '#fff' }} />}

                        </Button>

                        <Button transparent onPress={() => this.props.navigation.navigate('userProfile')} style={{
                            alignSelf: 'center',
                            borderWidth: 1, borderColor: '#fff', borderRadius: 60, paddingTop: 25, paddingBottom: 25
                        }}>

                            {this.state.loading ? <ActivityIndicator style={{ width: 43 }} size="small" color="#fff" /> : null}
                            {this.state.loading ? null : <Icon large name='md-person' style={{ color: '#fff' }} />}

                        </Button>

                    </View>


                </View>

            </ImageBackground>




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
        height: 100,
        width: 100,
        borderRadius: 60,
        overflow: 'hidden'
    },
    profileImg: {
        height: 100,
        width: 100
    },
});