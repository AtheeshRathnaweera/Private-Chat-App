
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import LogInScreen from './Components/LogInScreen';
import HomeScreen from './Components/HomeScreen';
import AuthLoadingScreen from './Components/AuthLoadingScreen';
import ChatScreen from './Components/ChatScreen';
import ProfileScreen from './Components/ProfileScreen';


import ViewGalleryScreen from './Components/ViewGalleryScreen';
import CreateARoomID from './Components/CreateARoomID';
import ViewRoomData from './Components/ViewRoomData';
import CreateANewAlbum from './Components/CreateANewAlbum';
import ViewPhotos from './Components/ViewPhotos';
import UpdateAAlbum from './Components/UpdateAAlbum';


// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = createStackNavigator({
  home: HomeScreen,
  chatScreen: ChatScreen,
  //chatScreen: giftedChatTest,
  userProfile: ProfileScreen,
  viewGallery: ViewGalleryScreen,
  viewRoomData : ViewRoomData,
  createANewAlbum: CreateANewAlbum,
  viewPhotos: ViewPhotos,
  updateAnAlbum : UpdateAAlbum
});

const AuthStack = createStackNavigator({
  LogIn: LogInScreen,
  createANewRoom: CreateARoomID
});

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
