import {HTTPNetworkInterface} from "apollo-client/transport/networkInterface";


export const setApolloHeader = (networkInterface: HTTPNetworkInterface, token) => {
  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }

      // get the authentication token from local storage if it exists
      req.options.headers['authorization'] = token ? `${token}` : null;
      next();
    }
  }
  ]);
};
