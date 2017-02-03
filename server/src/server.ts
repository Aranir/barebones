
import * as  express from 'express'
import * as cors from 'cors'
import * as bodyParser from "body-parser";
import {graphqlExpress, graphiqlExpress} from "graphql-server-express";
import {schema} from "./data/schema";
import * as _ from 'lodash'
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Post} from "./entities/Post";
import {Author} from "./entities/Author";
import {ConnectionManager} from "typeorm";
import {Container} from "typedi";
import {Chance} from 'chance';

let chance = new Chance();

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





const connectionManager = Container.get(ConnectionManager);


connectionManager.createAndConnect({
    driver: {
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "root",
      password: "root",
      database: "foodOrder"
    },
    entities: [
        Author,
        Post
    ],
    autoSchemaSync: true,
    dropSchemaOnConnection: true
}).then(connection => {
    // here you can start to work with your entities
    _.times(10, () => {
        let author = new Author();
        author.firstName = chance.first();
        author.lastName = chance.last();

        let post = new Post();
        post.author = author;
        post.title = `A post by ${author.firstName} ${author.lastName}`;
        post.text = chance.paragraph();
        post.tags = chance.word();
        author.posts.push(post);

        let authorRepo = connection.getRepository(Author);

        authorRepo.persist(author).catch(reason =>{
            console.log("Failed: ", reason)
        });
    });
}).catch(error => console.log(error));

const GRAPHQL_PORT = 4000;


let graphQLServer = express();

graphQLServer.use(cors(corsOptions));


graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
    schema: schema(),
    context: {},
}));

graphQLServer.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
}));


graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));








