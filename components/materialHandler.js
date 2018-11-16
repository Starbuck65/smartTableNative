import React, {Component} from 'react';
import {Platform, StyleSheet, Alert} from 'react-native';
import SocketIOClient from 'socket.io-client';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import axios from 'axios';
import {Image, Modal} from 'react-native';
import { list_materials } from './list_materials.js';
import { Container, Content,Card ,Input, Label, DeckSwiper, CardItem, Footer,FooterTab,Left, Right, Body,Text, Button, H1, H3, H2, Grid, Row, Col, Icon, View, Thumbnail, Form, Item,List, ListItem} from 'native-base';
import Markdown from 'react-native-markdown-renderer';
import Swiper from 'react-native-deck-swiper';
import Video from 'react-native-video';
const back = require ('./tablet_instructions.mp4');
import { withNavigation } from 'react-navigation';


const styles = StyleSheet.create({

  modal: {
    padding: 20,
    flex: 1
  },
  mail: {
    padding: 20,
    flex: 1,
    backgroundColor: "#FFFFFF"

  },
  deck: {
    height: 850,
    backgroundColor: "#FFFFFF"
  },
  card: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
    elevation:3
},
related: {
  paddingBottom: 10
},
backgroundVideo: {
  width:780,
  height:1000,
  flex: 1,
  backgroundColor: "#FFFFFF"
  },
modalHelp:
{
  backgroundColor: "#FFFFFF",
  flex: 1,
  padding: 20,
},

extra:{
  backgroundColor: "#FF0000",
  position: 'absolute',
   top: 0,
   left: 0,
   bottom: 0,
   right: 0,
}
});

class MaterialHandler extends Component {
  settingOpen = ()=>{
    this.props.navigation.navigate('Auth');
  }
    constructor(props) {
      super(props);
      this.state = {
        materials: [],
        namelist: [ 'Please, place the desired sample on the table'],
        modalVisible: false,
        modalStyle : {},
        helpVisible: false,
        mailVisible: false,
        email: '',
      };
      this.onReceivedMessage = this.onReceivedMessage.bind(this);
      this.pong = this.pong.bind(this);

      this.ip = this.props.ip;
      this.printer = this.props.printer;
      const socket_uri = 'http://' + this.ip + ':4200';
      console.log(socket_uri);
      this.socket = SocketIOClient(socket_uri);
      this.socket.on('tag',this.onReceivedMessage);
      this.socket.on('ping', this.pong);
      console.log("en el controller");
      console.log(this.ip);
}


  pong(data){
    this.socket.emit('pong', {beat:1});
    console.log('PONG');
    //alert(this.socket);
  }

    onReceivedMessage(messages) {
      this.setState({materials: messages});
    }


    getMaterialInfo = (tag) => {
      const materials = this.props.data.materials;
      const found = materials.find((element)=>{
        return element.tag === tag;
      });
      return found!== undefined ? found: null;
    }

    listMaterials(materials) {
      var list =[];

      for (var i = 0; i < materials.length; i++) {
        const material = this.getMaterialInfo(materials[i]);
        if (material == null )
          return

        const style = this.getStyleInfo(material.style);

        list.push(<Card
          key={i} >

          <CardItem cardBody>
            {material.photo.length > 0 ? <Image style={{height: 200, width: 800, flex: 1}} source = {{uri: 'https://media.graphcms.com/resize=w:800,h:200,fit:crop/' + material.photo[0].handle}}/> : null }
          </CardItem>
          <CardItem>
              <Body>
                <H1>{material.name}</H1>
                <Markdown>{material.description}</Markdown>
              </Body>
          </CardItem>
          {style!= null ? this.styleCard(style): null}
          <CardItem>
            {this.listRecomendations(material.id)}
          </CardItem>
          </Card>);
      }
      return list;

    }
    styleCard = (style)=>{
        return(
          <CardItem>
            <Left>

              <Button onPress={() => this.openModal(style)} transparent>
                <Icon type="FontAwesome" name="question"/><Text>{style.name}</Text>
              </Button>
              </Left>
            </CardItem>
        )
    }

    openModal = (style)=>{
      this.setState({
        modalVisible: true,
        modalStyle: style
      })
    }

    getStyleInfo = (styleName) => {
      const styles = this.props.data.styleInfoes;
      const found = styles.find((element)=>{
        return element.style === styleName;
      });
      return found!== undefined ? found: null;
    }

    listRecomendations = (materialID)=>{
      const recomendations = this.props.data.recomendations;
      let r = [];
      const found = recomendations.find((element)=>{
        return element.material.id === materialID;
      });
      console.log(found);
      if (found === undefined){
        return r;
      }

      const names = found.links.map((element, i)=>{
        console.log(element);
        const _id = element.id;
        const obj = this.props.data.materials.find(obj => obj.id == _id);
        console.log(obj);
        //return <ListItem key={i} thumbnail><Left><Thumbnail source={{uri: 'https://media.graphcms.com/resize=w:200,h:200,fit:crop/' + obj.photo[0].handle}}/></Left><Body><Text>{element.name}</Text></Body></ListItem>
        return <Col key={i}><Thumbnail source={{uri: 'https://media.graphcms.com/resize=w:200,h:200,fit:crop/' + obj.photo[0].handle}}/><Text>{element.name}</Text></Col>
        //return element.name
      })
      //return <Body><H3>Wir empfehlen dir, ihn wie folgt zu kombinieren: </H3><Text>{names.join(', ')}</Text></Body>;
      return <Body><H2 style={styles.related}>Wir empfehlen dir, ihn wie folgt zu kombinieren: </H2><Grid>{names}</Grid></Body>;

    }


    nprintMaterials(){
      var base_url = 'http://' + this.printer + ':4200/print';

      const materials = this.state.materials;
      var _m = [];
      for (var i = 0; i < materials.length; i++) {
        _m.push(this.getMaterialInfo(materials[i]));
      }

      console.log(_m);
      console.log(base_url);
      axios.post(base_url,{
          materials: _m
      })
        .then(function(response){
          console.log("Print sent");
          console.log(response);
          Alert.alert('Druck', response.data);
        })
        .catch(function (error) {
          console.log("ERROR: Can't print.");
          console.log(error);
          return Alert.alert("Network Error: Printer Unreachable.");
        })

        // Disable animation
        setTimeout(() => {
            //this.loadingButton.showLoading(false);
        }, 15000);
    }

    sendMaterials(){
      const mail = this.state.email;
      console.log(mail);
      var base_url = 'http://' + this.ip + ':4200/mail';
      console.log(base_url);
      const materials = this.state.materials;
      var _m = [];
      for (var i = 0; i < materials.length; i++) {
        _m.push(this.getMaterialInfo(materials[i]));
      }

      console.log(_m);
      axios.post(base_url,{
          materials: _m,
          email: mail
      })
        .then(function(response){
          console.log("Print sent");
          console.log(response);
          Alert.alert('Email', response.data);
        })
        .catch(function (error) {
          console.log("ERROR: Can't send the mail.");
          return alert("Error", 'Error');
        })

        // Disable animation
        setTimeout(() => {
            //this.loadingButton.showLoading(false);
        }, 15000);
    }

    printMaterials() {
      // Show button animation
      //this.loadingButton.showLoading(true);

      // Prepare URL and add material names
      var base_url = 'http://' + this.ip + ':8088/print_pdf?';
      var url = base_url;
      const materials = this.state.materials;
      for (var i = 0; i < materials.length; i++) {
        const material = this.getMaterialInfo(materials[i]);
          url = url + 'value' + (i+1) + '=' + material.name + '&';
      }
      // Set timestamp
      url = url + String(Date.now());


      console.log(url)
      // Get request to RPi
      axios.get(url)
        .then(function(response){
          console.log("Print sent");
          alert("Printing...");
        })
        .catch(function (error) {
          console.log("ERROR: Can't print.");
          return alert("Network Error: Printer Unreachable.");
        })

        // Disable animation
        setTimeout(() => {
            //this.loadingButton.showLoading(false);
        }, 15000);

    }

    styleModal= (style) => {

        return (
          <View>
            <H1>{style.name}</H1>
            <Markdown>{style.description}</Markdown>
          </View>
      );
    }

    deckStylePictures = (style) => {

      const photos = style.photos;
      if (photos.length === 0){
        return null;
      }

      return(
        <View style={styles.deck}>
        <Swiper
          cards={photos}
          renderCard={(card) => {
              return (
                <View style={styles.card}>
                    <Image style={{ height: 720, flex: 1, width:760}} source={{uri: 'https://media.graphcms.com/resize=w:760,h:800,fit:crop/' + card.handle}} />
                </View>
              )
          }}
          onSwiped={(cardIndex) => {console.log(cardIndex)}}
          onSwipedAll={() => {console.log('onSwipedAll')}}
          cardIndex={0}
          infinite={true}
          backgroundColor={'#FFFFFF'}
          cardHorizontalMargin={0}
          cardStyle={{
            width: 760,
            height: 720
          }}
          stackSize= {4}>
      </Swiper>
      </View>

        );
    }

    footerComp = () => {
      const style = this.state.modalStyle;
      const materials = this.state.materials;
      return(
        <Footer>
         <FooterTab>
          <Button disabled={materials.length==0} onPress={()=>this.nprintMaterials()} primary>
            <Icon name="print" /><Text>Druck</Text>
          </Button>
          <Button  disabled={materials.length==0} onPress={()=>this.setState({mailVisible: true})} primary>
            <Icon name="mail" /><Text>Send by mail</Text>
          </Button>
         <Button  disabled={materials.length==0} onPress={()=>this.setState({helpVisible: true})} light>
         <Icon name="help" /><Text>Hilfe</Text></Button>

         <Button disabled={materials.length!=0} onPress={()=>{this.settingOpen()}} light>
          <Icon name="settings" />
        </Button>
          </FooterTab>
        </Footer>
      )
    }

    videoWait = ()=>{
      return(
        <View>

        <View styles={styles.extra}>
          <Video source={back}
          muted={false}
          repeat={true}
          resizeMode='cover'
          paused={false}
            style={styles.backgroundVideo} />
        </View>

        </View>

      )
    }


    render() {
      const style = this.state.modalStyle;
      const materials = this.state.materials;
        return (
          <Container>
            <Content>


          {materials.length!==0 ? this.listMaterials(materials): this.videoWait()}

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
              }}>
                <View  style={styles.modal}>
                    {style.name !== undefined ? this.styleModal(style) : null}
                    {style.name !== undefined ? this.deckStylePictures(style): null}
                  <Button onPress = {() => {
                      this.setState({modalVisible:false});
                    }}>
                      <Text>Close</Text>
                  </Button>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                hardwareAccelerated={true}
                visible={this.state.helpVisible}
                onRequestClose={() => {
                }}>
                  <View style={styles.modalHelp}>
                      <Video source={back}
                          muted={false}
                          repeat={true}
                          resizeMode='cover'
                          paused={false}
                          style={styles.backgroundVideo} />

                    <Button onPress = {() => {
                        this.setState({helpVisible:false});
                      }}>
                        <Text>Close</Text>
                    </Button>
                  </View>
                </Modal>
                <Modal
                  animationType="slide"
                  transparent={true}
                  hardwareAccelerated={true}
                  visible={this.state.mailVisible}
                  onRequestClose={() => {
                  }}>
                    <View style={styles.mail}>

                    <Content>
                      <Form>
                        <Item inlineLabel last>
                          <Label>Your email address:</Label>
                          <Input  name="email" onChangeText={(value) => this.setState({email: value})} autoFocus= {true} keyboardType={'email-address'} autoCorrect={false} clearButtonMode={'always'}>{this.state.email}</Input>
                          </Item>
                        <Button block success large onPress = {() => {
                          this.sendMaterials();
                          this.setState({email: ''})
                            this.setState({mailVisible:false});
                          }}>
                            <Text>Send</Text>
                        </Button>
                        <Button block onPress = {() => {
                          this.setState({email: ''})
                            this.setState({mailVisible:false});
                          }}>
                            <Text>Cancel</Text>
                        </Button>
                      </Form>
                    </Content>

                    </View>
                  </Modal>
          </Content>
          {this.footerComp()}


          </Container>
              );
    }
}

export default withNavigation(MaterialHandler);
