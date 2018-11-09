import React, {Component} from 'react';
import AppWrapper from './components/AppWrapper';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { AsyncStorage } from "react-native";
import { SwitchNavigator, createSwitchNavigator, createStackNavigator } from 'react-navigation';
import SignInScreen from './screens/SignInScreen/SignIn';
import SettingScreen from './screens/SettingScreen/Setting';
import { Provider } from 'react-redux';
import store from './store';
import { connect } from 'react-redux';
import { actions } from './store/actions';
import {Text} from 'native-base';

const GRAPHCMS_API = 'https://api-euwest.graphcms.com/v1/cjlqmvcyy0zny01gppvg11ts2/master'

const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHCMS_API }),
 cache: new InMemoryCache()
})

class App extends Component {

  static navigationOptions = {
    title: 'Smart table',
  };

  constructor(props) {
    super(props);
    console.log("Props en el constructor");
    console.log(props);
  }




  render() {
    const { navigation } = this.props;
    const ip = navigation.getParam('ip','0');
    const printer = navigation.getParam('printer','0');
    return (
        <AppWrapper ip={ip} printer={printer}/>
    );
  }

}

class LoadingScreen extends Component{
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }
    // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const ipConfig = await AsyncStorage.getItem('SERVER_IP');
    const printerConfig = await AsyncStorage.getItem('PRINTER_IP');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    console.log("tengo datos");
    console.log(ipConfig)
    if (ipConfig){
      //this.props.loadIp(ipConfig);
      this.props.navigation.navigate('App', {ip : ipConfig, printer: printerConfig});
    }else{
      this.props.navigation.navigate('Auth');

    }
  };

  render() {
      return <Text>Loading</Text>;
    }
}

const AppStack = createStackNavigator({ Home: App});
const AuthStack = createStackNavigator({ SignIn: SignInScreen, Settings: SettingScreen });

export const Navigator = createSwitchNavigator (
  {
    AuthLoading: LoadingScreen,
    App: App,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading',
  }
)

class TableApp extends Component {
  render() {
    return (

      <ApolloProvider client={client}>
        <Provider store={store}>
          <Navigator />
        </Provider>
       </ApolloProvider>
    )
  }
}

export default TableApp
