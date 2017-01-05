///<reference path="data/schema.ts"/>

import * as  express from 'express'
import * as cors from 'cors'
// import {buildSchema} from "graphql";
// import resolveFunctions from "./src.data/resolvers";
// import {Author} from "./src.data/connectors";


// import { graphqlConnect, graphiqlConnect } from 'graphql-server-express';

import * as bodyParser from "body-parser";
import {graphqlExpress, graphiqlExpress} from "graphql-server-express";
// import {GraphQLSchema} from "graphql/type/schema";
// import {makeExecutableSchema} from "graphql-tools";
import { GraphQLOptions } from 'graphql-server-core';
import {schema} from "./data/schema";


var whitelist = [
    'http://localhost:3000',
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};


const GRAPHQL_PORT = 4000;


let graphQLServer = express();

graphQLServer.use(cors(corsOptions));


graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
    schema: schema,
    context: {},
}));

graphQLServer.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}));


graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));


// // Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);
//
// // The root provides a resolver function for each API endpoint
// // var root = {
// //     hello: () => {
// //         return 'Hello world!';
// //     },
// // };
//
// let root = {
//     author: () => {
//         return {firstName: "Roger", lastName: "King"}
//     }
// };
//
// Author.findAll().map((a: Author) => {
//     console.log(`We found ${a.firstName} ${a.lastName}`);
// });
//
// let app = express();
// app.use('/graphql', graphqlHTTP({
//     schema: Schema,
//     rootValue: resolveFunctions,
//     graphiql: true,
// }));
// app.listen(4000);
// console.log('Running a GraphQL API server at localhost:4000/graphql');





