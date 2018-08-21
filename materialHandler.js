import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import SocketIOClient from 'socket.io-client';
import axios from 'axios';
import { list_materials } from './list_materials.js';

export default class MaterialHandler extends Component {
    constructor(props) {
      super(props);
      this.state = {
        material: [ {"TAG":"Waiting for detections..."} ],
        //nameMaterial: 'test'
        namelist: [ 'test', 'test2']

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
            flex:1
          }}
          key={i} >{this.state.material[i].TAG} {this.state.namelist[i]}</Text>);
      }
      return list;

    }

    printMaterials(){

      var base_url = 'http://192.168.0.15:8088/download_pdf?';
      var url = base_url;
      for (var i = 0; i < this.state.material.length; i++) {
          url = url + 'value' + (i+1) + '=' + this.state.namelist[i] + '&';
      }

      console.log(url)


      axios.get(url)
        .then(function(response){
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    render() {
        return (
              <View style={{flex:1}}>
                {this.listMaterials()}
                <Button onPress={this.printMaterials}
                  title="Print"
                  color="#0000FF"
                  />
              </View>


              );
    }
}
const styles = StyleSheet.create({

    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
