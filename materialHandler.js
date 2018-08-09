import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import SocketIOClient from 'socket.io-client';

const test_materials = {
  "0000000000000001": '#FE0104',
   "0000000000000002": '#0172FE',
"0000000000000003": '#F9FE01',
 "0000000000000004": '#15FE01',
 "0000000000000005": '#000000'
}


export default class MaterialHandler extends Component {
    constructor(props) {
      super(props);
      this.state = {
        material: [ {"TAG":"Waiting for detections..."} ],
        backgroundColor: '#F5FCFF'
      };

      this.onReceivedMessage = this.onReceivedMessage.bind(this);

      this.socket = SocketIOClient('http://192.168.0.13:4200');
      this.socket.on('tag',this.onReceivedMessage);
}

    onReceivedMessage(messages) {
      this.setState({material: messages});
      this.epcTranslator(messages);
      }

    epcTranslator(materials){
      var color_code = test_materials[materials[0].TAG];
      console.log('Tag: ' + test_materials[materials[0].TAG]);
      console.log('Color code: ' + color_code);
      this.setState({backgroundColor: color_code});

    }

    listMaterials() {
      var list =[];
      for (var i = 0; i < this.state.material.length; i++) {
        list.push(<Text
          style={{
            backgroundColor: this.state.backgroundColor,
            flex:1          
          }}
          key={i} >{this.state.material[i].TAG}</Text>);
      }
      return list;

    }


    render() {
        return (
              <View style={{flex:1}}>
                {this.listMaterials()}
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
