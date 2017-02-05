import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import App from './App';
import './index.css';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import ApolloProvider from "react-apollo/lib/ApolloProvider";
import * as $ from 'jquery'
export declare function require<T>(a: string): any
import * as axios from 'axios';
import {Response} from "_debugger";
import {setApolloHeader} from "./utilities/apolloHelpers";

axios.defaults.baseURL = 'http://localhost:4000/';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:4000/graphql',
  // opts: {
  //   credentials: 'same-origin',
  // }
});

interface loginResponse extends Response {
  data: {token: string, expiresAt: number}
}

let token = localStorage.getItem('token');
console.log("could we get token?", token);

setApolloHeader(networkInterface, token);


const client = new ApolloClient({
  networkInterface: networkInterface
});

ReactDOM.render(
  (
    <AppContainer>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </AppContainer>
  ),
  document.getElementById('root') as HTMLElement
);

interface RequireImport {
  default: any;
}

if ((module as any).hot) {
  (module as any).hot.accept('./App.tsx', () => {
    const NextApp = require<RequireImport>('./App').default
    ReactDOM.render(
      <AppContainer>
        <ApolloProvider client={client}>
          <NextApp />
        </ApolloProvider>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
