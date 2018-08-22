import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import MaterialHandler from './materialHandler.js';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.header}>          </Text>
          <Text style={styles.header}>Smart Table</Text>
          <MaterialHandler style={styles.materialhandler} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  header: {
    textAlign: 'center',
    fontSize: 46,
    fontWeight: 'bold',
  },
  materialhandler: {

  },

});
