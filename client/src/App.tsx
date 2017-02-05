import * as React from 'react';
import './App.css';
import Test from "./Test";
import gql from "graphql-tag/index";
import graphql from "react-apollo/lib/graphql";
import {Author} from "./entities/Author";
import {Button} from "react-bootstrap";
import ApolloClient from "apollo-client/ApolloClient";
import {withApollo} from "react-apollo";
import {setApolloHeader} from "./utilities/apolloHelpers";
import * as axios from 'axios'; import LoginModal from "./LoginModal";

export declare function require<T>(a: string): any


const logo = require<string>('./logo.svg');

const loggedInQuery = gql` query {
    loggedInAuthor {
        id
        firstName
        lastName
    }
}`;

interface AppProps {
  client: any
  data: {
    loggedInAuthor: Author
    loading: boolean
    refetch: () => void

  },
}

interface AppState {
  showModal: boolean;
}

class App extends React.Component<AppProps, AppState> {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  loginButton() {
    if (!this.props.data.loggedInAuthor) {
      return <Button onClick={this.onLogin.bind(this)}>Login</Button>
    } else {
      return <Button onClick={this.onLogout.bind(this)}>Logout</Button>
    }
  };

  onLogin() {
    console.log("we clicked login", this.state.showModal);
    this.setState({showModal: true});

  };

  onCloseLoginModal() {
    console.log("closing modal");
    this.setState({showModal: false});
  }

  onSubmit(text: string) {
    console.log("we have the texet", text);
    this.setState({showModal: false});
    axios.post('/login', {
      username: text,
      password: 'nothing'
    }).then((response: any) => {
      let token = response.data.token;
      let expiresAt = response.data.expiresAt;
      localStorage.setItem("token", token);
      localStorage.setItem("expiresAt", expiresAt);
      setApolloHeader(this.props.client.networkInterface, token);
      this.props.client.resetStore();
    })
  };



  onLogout(event) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    setApolloHeader(this.props.client.networkInterface, null);
    this.props.client.resetStore();
  };

  render() {
    console.log("App props: ", this.state.showModal);
    let author = this.props.data.loggedInAuthor;
    let title = "Welcome to React-Typescript";
    if (author) {
      title = `Welcome ${author.firstName} to React-Typescript`;
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h2>{title}</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>
          {this.loginButton()}
        </div>
        <div className="App-body">
          <Test />
        </div>
        <LoginModal onLogin={this.onSubmit.bind(this)}
                    showModal={this.state.showModal}
                    onClose={this.onCloseLoginModal.bind(this)}/>
      </div>
    );
  }
}
export default withApollo(graphql(loggedInQuery)(App))
// export default withApollo(App);


