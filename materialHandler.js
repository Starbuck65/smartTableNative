import React, {Component} from 'react';
import {Platform, StyleSheet, View } from 'react-native';
import SocketIOClient from 'socket.io-client';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import axios from 'axios';
import { list_materials } from './list_materials.js';
import { Content,Card , CardItem, Left,Body,Text, Button} from 'native-base';


const ip_r= 'http://172.18.13.214';

export default class MaterialHandler extends Component {
    constructor(props) {
      super(props);
      this.state = {
        material: [ 'Waiting', 'Detections' ],
        namelist: [ 'Please, place the desired sample on the table'],

      };

      this.onReceivedMessage = this.onReceivedMessage.bind(this);

      this.socket = SocketIOClient(ip_r + ':4200');
      this.socket.on('tag',this.onReceivedMessage);
}

    onReceivedMessage(messages) {
      this.setState({material: messages});
      this.epcTranslator(messages);
      }

    epcTranslator(materials){

      /*
      var name_material = list_materials[materials[0].TAG];
      console.log('Detected Tag: ' + list_materials[materials[0].TAG]);
      console.log('Detected Name: ' + name_material);
      this.setState({nameMaterial: name_material});
      */

      var recv_materials = []
      for (var i = 0; i < this.state.material.length; i++) {
        recv_materials[i] = list_materials[materials[i]];
        console.log('Detected: '+ i +': ' + recv_materials[i]);
      }

      this.setState({namelist: recv_materials});

    }

    listMaterials() {
      var list =[];

      for (var i = 0; i < this.state.material.length; i++) {
        list.push(<Card
          key={i} >
          <CardItem>
            <Left>
              <Body>
                <Text>{this.state.namelist[i]}</Text>
              </Body>
            </Left>
          </CardItem>
          </Card>);
      }
      return list;

    }

    printMaterials() {
      // Show button animation
      //this.loadingButton.showLoading(true);

      // Prepare URL and add material names
      var base_url = ip_r + ':8088/print_pdf?';
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


    render() {
        return (
          <Content>
          {this.listMaterials()}
            <Button onPress={this.printMaterials.bind(this)} light><Text> Print </Text></Button>
          </Content>





              );
    }
}
