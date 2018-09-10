import React, {Component} from 'react';
import MaterialHandler from './materialHandler.js';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';

type Props = {};
export default class App extends Component<Props> {

  constructor() {
  super();
  this.state = {
    isReady: false
  };
}

  async componentWillMount() {
  await Expo.Font.loadAsync({
    'Roboto': require('native-base/Fonts/Roboto.ttf'),
    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
  });
  this.setState({ isReady: true });
}


  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }

    return (
      <Container>
       <Header>
       <Body>
          <Title>Smart Table Interface</Title>
      </Body>
       </Header>

       <Content>
        <MaterialHandler />
        </Content>

        <Footer>

        </Footer>
       </Container>

    );
  }

}
