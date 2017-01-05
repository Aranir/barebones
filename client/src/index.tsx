
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import './index.css';
// import {store} from './CouldronStore';
// import {Provider} from 'react-redux';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import ApolloProvider from "react-apollo/lib/ApolloProvider";

export declare function require<T>(a: string): any

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:4000/graphql' }),
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
