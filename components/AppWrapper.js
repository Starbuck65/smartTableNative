import React, {Component} from 'react';
import MaterialHandler from './materialHandler.js';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { withNavigation } from 'react-navigation';


import { Query } from "react-apollo";
import gql from 'graphql-tag'




const GET_MATERIALS = gql`
    {
      materials {
        id,
        tag,
        name,
        description,
        style,
        photo{
          fileName,
          handle
        }
    },
    styleInfoes{
      style,
      name,
      description,
      photos{
        handle
      }
    },
    recomendations{
      material{
        name,
        id
      }
      links{
        name,
        id
      }
    }
  }
`


class AppWrapper extends Component {



  render() {
    return(
      <Query query={GET_MATERIALS}>
      {({loading, error, data}) =>{
        if (loading) return (<Text>Loading...</Text>);
        if (error) return `Error! ${error.message}`;
        console.log(data);
        return (
          <MaterialHandler data={data} ip={this.props.ip} printer={this.props.printer}/>
        )}}
      </Query>
    );
  }

}
export default withNavigation(AppWrapper);
