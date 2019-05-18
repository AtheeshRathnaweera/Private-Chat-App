

import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import LogInScreen from './Components/LogInScreen';
import HomeScreen from './Components/HomeScreen';
import AuthLoadingScreen from './Components/AuthLoadingScreen';
import ChatScreen from './Components/ChatScreen';
import ProfileScreen from './Components/ProfileScreen';


// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = createStackNavigator({
  home: HomeScreen,
 chatScreen: ChatScreen,
 //chatScreen: giftedChatTest,
  userProfile: ProfileScreen
});
const AuthStack = createStackNavigator({ LogIn: LogInScreen });

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
