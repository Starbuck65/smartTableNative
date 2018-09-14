import React, {Component} from 'react';
import { Container, Header, Content, Button, Text, Form, Item, Input, Label, Grid, Row, Col } from 'native-base';
import { AsyncStorage } from "react-native";
import { connect } from 'react-redux';
import { actions } from '../../store/actions';


export default class SettingScreenRoot extends Component {

  constructor(){
    super();
    this.state = {ip:''};
    this._bootstrapAsync();

  }

  _storeData = async (ip) => {
    try {
      await AsyncStorage.setItem('SERVER_IP', ip);
    } catch (error) {
      // Error saving data
    }
  }

  _bootstrapAsync = async () => {
    const ipConfig = await AsyncStorage.getItem('SERVER_IP');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    console.log(ipConfig)
    if (ipConfig){
      //this.props.loadIp(ipConfig);
      this.setState({ip: ipConfig});
    }
  };

  saveandLogOut = ()=>{
    this._storeData(this.state.ip);
    console.log("IP en configuracion: " + this.state.ip);
    this.props.navigation.navigate('App', {ip : this.state.ip});
  }

  render(){
    return(
      <Container>
        <Content>
          <Form>
            <Item inlineLabel>
              <Label>Password</Label>
              <Input onChangeText={(value) => this.setState({ip: value})} name="pass">{this.state.ip}</Input>
            </Item>
            <Item inlineLabel>
              <Button onPress={()=>{this.saveandLogOut()}}><Text>Save and Logout</Text></Button>
            </Item>
          </Form>
        </Content>
      </Container>
    )
  }
}


const mapStateToProps = (state) => ({
  ip: state.ip
});

const mapDispatchToProps = dispatch => {
  return {
    loadIp: (ip) => dispatch(actions.loadIp(ip))
  }
}


const SettingScreen = connect(mapStateToProps, mapDispatchToProps)(SettingScreenRoot);
