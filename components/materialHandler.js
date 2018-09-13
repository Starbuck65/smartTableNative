import React, {Component} from 'react';
import {Platform, StyleSheet } from 'react-native';
import SocketIOClient from 'socket.io-client';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import axios from 'axios';
import {Image, Modal} from 'react-native';
import { list_materials } from './list_materials.js';
import { Container, Content,Card , DeckSwiper, CardItem, Left,Body,Text, Button, H1, H3, Grid, Row, Col, Icon, View} from 'native-base';
import Markdown from 'react-native-markdown-renderer';
import Swiper from 'react-native-deck-swiper';
import Video from 'react-native-video';
const back = require ('./background.mp4');

const styles = StyleSheet.create({

  modal: {
    padding: 20,
    flex: 1
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
backgroundVideo: {
    flex: 1
    width:800,
    heigh:800
  },

});

export default class MaterialHandler extends Component {

    constructor(props) {
      super(props);
      this.state = {
        materials: [],
        namelist: [ 'Please, place the desired sample on the table'],
        modalVisible: false,
        modalStyle : {}
      };
      this.onReceivedMessage = this.onReceivedMessage.bind(this);
      this.ip = this.props.ip;
      const socket_uri = 'http://' + this.ip + ':4200';
      console.log(socket_uri);
      this.socket = SocketIOClient(socket_uri);
      this.socket.on('tag',this.onReceivedMessage);
      console.log("en el controller");
      console.log(this.ip);
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
      if (found === undefined){
        return r;
      }

      const names = found.links.map((element, key)=>{
        return element.name
      })
      return <Body><H3>We recomend you: </H3><Text>{names.join(', ')}</Text></Body>;

    }

    printMaterials() {
      // Show button animation
      //this.loadingButton.showLoading(true);

      // Prepare URL and add material names
      var base_url = this.ip + ':8088/print_pdf?';
      var url = base_url;
      for (var i = 0; i < this.state.material.length; i++) {
          url = url + 'value' + (i+1) + '=' + this.state.namelist[i] + '&';
      }
      // Set timestamp
      url = url + String(Date.now());


      console.log(url)
      // Get request to RPi
      axios.get(url)
        .then(function(response){
          console.log("Print sent");

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

    videoWait = ()=>{
      return(<View>
        <Video source={back}   // Can be a URL or a local file.
        style={styles.backgroundVideo} />
       </View>
      )
    }


    render() {
      const style = this.state.modalStyle;
      const materials = this.state.materials;
        return (
          <Content>
          {materials.length!==0 ? this.listMaterials(materials): this.videoWait()}
            <Button onPress={this.printMaterials.bind(this)} light><Text> Print </Text></Button>
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
          </Content>

              );
    }
}
