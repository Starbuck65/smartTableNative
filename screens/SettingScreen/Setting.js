import React, {Component} from 'react';
import { Container, Header, Content, Button, Text, Form, Item, Input, Label, Grid, Row, Col } from 'native-base';
import { AsyncStorage } from "react-native";
import { connect } from 'react-redux';
import { actions } from '../../store/actions';


export default class SettingScreenRoot extends Component {

  constructor(){
    super();
    this.state = {ip:'', printer:''};
    this._bootstrapAsync();

  }

  _storeData = async (ip, printer) => {
    try {
      await AsyncStorage.setItem('SERVER_IP', ip);
      await AsyncStorage.setItem('PRINTER_IP', printer);

    } catch (error) {
      // Error saving data
    }
  }

  _bootstrapAsync = async () => {
    const ipConfig = await AsyncStorage.getItem('SERVER_IP');
    const printerConfig = await AsyncStorage.getItem('PRINTER_IP');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    console.log(ipConfig)
    if (ipConfig){
      //this.props.loadIp(ipConfig);
      this.setState({ip: ipConfig});
    }
    if (printerConfig){
      //this.props.loadIp(ipConfig);
      this.setState({printer: printerConfig});
    }
  };

  saveandLogOut = ()=>{
    this._storeData(this.state.ip, this.state.printer);
    console.log("IP en configuracion: " + this.state.ip);
    this.props.navigation.navigate('App', {ip : this.state.ip, printer: this.state.printer});
  }

  render(){
    return(
      <Container>
        <Content>
          <Form>
            <Item inlineLabel>
              <Label>IP</Label>
              <Input onChangeText={(value) => this.setState({ip: value})} name="pass">{this.state.ip}</Input>
            </Item>
            <Item inlineLabel>
              <Label>Printer</Label>
              <Input onChangeText={(value) => this.setState({printer: value})} name="printer">{this.state.printer}</Input>
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
  ip: state.ip,
  printer: state.printer
});

const mapDispatchToProps = dispatch => {
  return {
    loadIp: (ip) => dispatch(actions.loadIp(ip))
  }
}


const SettingScreen = connect(mapStateToProps, mapDispatchToProps)(SettingScreenRoot);
