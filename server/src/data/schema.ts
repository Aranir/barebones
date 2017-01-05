// import {GraphQLSchema} from 'graphql';
import resolvers from "./resolvers";
// import {buildSchema} from "graphql/utilities/buildASTSchema";
import {makeExecutableSchema} from 'graphql-tools';
import gql from "graphql-tag/index";
import {print} from 'graphql-tag/printer';


const typeDefinition = gql`
  #This is a genius item
  type Post {
    #this is an identifier
    id: String! # the ! means that every author object _must_ have an id
    title: String
    text: String
    tags: [String]
    author: Author
  }

  type Author {
    id: String!
    firstName: String
    lastName: String
    posts: [Post]
  }

  # the schema allows the following query:
  type Query {
    author(firstName: String, lastName: String): Author
    authors: [Author]

  }
  type Mutation {
    createAuthor(firstName: String!, lastName: String!): Author
    createPost(authorId: String!, title: String!, text: String!, tags: [String]): Post
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;


export const schema = makeExecutableSchema({
    typeDefs: print(typeDefinition),
    resolvers: resolvers,
});

