// import {GraphQLSchema} from 'graphql';
import {resolvers} from "./resolvers";
import {Container} from "typedi";

// import {buildSchema} from "graphql/utilities/buildASTSchema";
import {makeExecutableSchema} from 'graphql-tools';
import gql from "graphql-tag/index";
import {print} from 'graphql-tag/printer'; import {ConnectionManager} from "typeorm";

const connectionManager = Container.get(ConnectionManager);


const typeDefinition = gql`
    #This is a genius item
    type Post {
        #this is an identifier
        id: Int! # the ! means that every author object _must_ have an id
        title: String
        text: String
        tags: [String]
        author: Author
    }

    type Author {
        id: Int!
        firstName: String
        lastName: String
        posts: [Post]
    }

    # the schema allows the following query:
    type Query {
        author(firstName: String, lastName: String): Author
        loggedInAuthor: Author
        authors: [Author]
        posts: [Post]

    }
    
    type Token {
        token: String
        expriesAt: Int
        error: String
    }
    
    type Mutation {
        createAuthor(firstName: String!, lastName: String!): Author
        createPost(authorId: Int!, title: String!, text: String!, tags: [String]): Post
        createToken(username: String!, password: String!): Token
    }

    schema {
        query: Query
        mutation: Mutation
    }
`;


export function schema() {
  return makeExecutableSchema({
    typeDefs: print(typeDefinition),
    resolvers: resolvers(connectionManager.get()),
  })
};

