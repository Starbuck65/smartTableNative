import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import SocketIOClient from 'socket.io-client';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import axios from 'axios';
import { list_materials } from './list_materials.js';

export default class MaterialHandler extends Component {
    constructor(props) {
      super(props);
      this.state = {
        material: [ {"TAG":"Waiting for detections..."} ],
        namelist: [ 'Please, place the desired sample on the table', 'test2'],
        isLoading: false
      };

      this.onReceivedMessage = this.onReceivedMessage.bind(this);

      this.socket = SocketIOClient('http://192.168.0.15:4200');
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
        recv_materials[i] = list_materials[materials[i].TAG];
        console.log('Detected Tag '+ i +': ' + list_materials[materials[i].TAG]);
        console.log('Detected Name '+ i +': ' + recv_materials[i]);
      }

      this.setState({namelist: recv_materials});

    }

    listMaterials() {
      var list =[];

      for (var i = 0; i < this.state.material.length; i++) {
        list.push(<Text
          style={{
            backgroundColor: "#FFFFFF" ,
            textAlign: 'center',
            fontSize: 26,

          }}
          key={i} >{this.state.namelist[i]} </Text>);
      }
      return list;

    }

    printMaterials() {
      // Show button animation
      this.loadingButton.showLoading(true);

      // Prepare URL and add material names
      var base_url = 'http://192.168.0.15:8088/print_pdf?';
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
          //console.log(response);
          console.log("Print sent");
          //this.loadingButton.showLoading(false);
        })
        .catch(function (error) {
          //console.log(error);
          console.log("ERROR: Can't print.");
          return alert("Network Error: Printer Unreachable.");
        })

        // Disable animation
        this.loadingButton.showLoading(false);

    }


    render() {
        return (
          <View style={{flex: 2, justifyContent: 'space-around'}} >
            
            <View>
              {this.listMaterials()}
            </View>

            <View>
              <AnimateLoadingButton
                ref={c => (this.loadingButton =c)}
                onPress={this.printMaterials.bind(this)}
                width={300}
                height={50}
                title="Print"
                titleFontSize={26}
                titleColor="rgb(255,255,255)"
                backgroundColor="rgb(0,15,255)"
                borderRadius={4}
                />
            </View>
          </View>

              );
    }
}
