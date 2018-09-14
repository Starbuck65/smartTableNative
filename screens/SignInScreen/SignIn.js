import React, {Component} from 'react';
import { Container, Header, Content, Button, Text, Form, Item, Input, Label, Grid, Row, Col } from 'native-base';


const PASSWORD= '1'


export default class SignInScreen extends Component<Props> {

  constructor() {
    super();
    this.state = {
      currentPass: '',
    } ;
  }


  handleTouch(key){
    const prev = this.state.currentPass;
    this.setState({
      currentPass: prev + key
    });
  }

  handleLogIn = ()=>{
    if (this.state.currentPass === PASSWORD){
      this.props.navigation.navigate('Settings');
    }
  }
  handleExit = ()=>{
      this.props.navigation.navigate('App');
  }
  render(){

    return(
      <Container>
          <Grid>
            <Row>
              <Col>
              <Form>
                <Item disabled inlineLabel>
                    <Label>Password</Label>
                    <Input name="pass" disabled>{this.state.currentPass}</Input>
                  </Item>
              </Form>
              </Col>
            </Row>
            <Row>
              <Col><Button onPress={()=>{this.handleTouch('1')}} transparent large block><Text>1</Text></Button></Col>
              <Col><Button onPress={()=>{this.handleTouch('2')}} transparent large block><Text>2</Text></Button></Col>
              <Col><Button onPress={()=>{this.handleTouch('3')}} transparent large block><Text>3</Text></Button></Col>
            </Row>
            <Row>
              <Col><Button onPress={()=>{this.handleTouch('4')}} transparent large block><Text>4</Text></Button></Col>
              <Col><Button onPress={()=>{this.handleTouch('5')}} transparent large block><Text>5</Text></Button></Col>
              <Col><Button onPress={()=>{this.handleTouch('6')}} transparent large block><Text>6</Text></Button></Col>
            </Row>
            <Row>
            <Col><Button onPress={()=>{this.handleTouch('7')}} transparent large block><Text>7</Text></Button></Col>
            <Col><Button onPress={()=>{this.handleTouch('8')}} transparent large block><Text>8</Text></Button></Col>
            <Col><Button onPress={()=>{this.handleTouch('9')}} transparent large block><Text>9</Text></Button></Col>
            </Row>
            <Row>
            <Col><Button onPress={()=>{this.handleTouch('0')}} transparent large block><Text>0</Text></Button></Col>
            </Row>
            <Row>
              <Col><Button onPress={()=>{this.handleLogIn()}} large block><Text>LogIn</Text></Button></Col>
              <Col><Button onPress={()=>{this.handleExit()}} large block><Text>Exit</Text></Button></Col>
            </Row>
          </Grid>

      </Container>

    )
  }
}
