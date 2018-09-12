import React, {Component} from 'react';
import { Container, Header, Content, Button, Text, Form, Item, Input, Label, Grid, Row, Col } from 'native-base';
import { AsyncStorage } from "react-native";
import { connect } from 'react-redux';
import { actions } from '../../store/actions';


export default class SettingScreenRoot extends Component {

  constructor(){
    super();
    this.ip = '';

  }

  _storeData = async (ip) => {
    try {
      await AsyncStorage.setItem('SERVER_IP', ip);
    } catch (error) {
      // Error saving data
    }
  }


  saveandLogOut = ()=>{
    this._storeData(this.ip);
    console.log("IP en configuracion: " + this.ip);
    this.props.navigation.navigate('App', {ip : this.ip});
  }

  render(){
    return(
      <Container>
        <Content>
          <Form>
            <Item inlineLabel>
              <Label>Password</Label>
              <Input onChangeText={(value) => this.ip = value} name="pass">2</Input>
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
