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
import {graphql} from 'graphql';
import {Request, Response} from 'express';
import * as jwt from "jsonwebtoken";
import {isNullOrUndefined} from "util";




let chance = new Chance();

let whitelist = [
  'http://localhost:3000',
];
let corsOptions = {
  origin: function (origin, callback) {
    let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
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
  let authorRepo = connection.getRepository(Author);

  let roger = new Author();
  roger.firstName = "Roger";
  roger.lastName = "Kung";

  authorRepo.persist(roger);

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


    authorRepo.persist(author).catch(reason => {
      console.log("Failed: ", reason)
    });
  });
}).catch(error => console.log(error));


const GRAPHQL_PORT = 4000;


let graphQLServer = express();


// graphQLServer.use(express.static('public'));
// graphQLServer.use(cookieParser());
graphQLServer.use(bodyParser.json());
// graphQLServer.use(session({
//   genid: function (req) {
//     return uuid.v4();
//   },
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: false,
//     maxAge : 3600000,
//     httpOnly: false
//   }
// }));
// graphQLServer.use(passport.initialize());
// graphQLServer.use(passport.session());

graphQLServer.use(bodyParser.urlencoded({extended: true}));
graphQLServer.use(cors(corsOptions));


// passport.serializeUser(function (author: Author, done) {
//   console.log("serilizing", author);
//   done(null, author.id);
// });
// passport.deserializeUser(function (id, done) {
//   console.log("deserializing");
//   connectionManager.get().getRepository(Author).findOneById(id).then(u => {
//     done(null, u);
//   })
// });
//
// passport.use('local', new Strategy({
//     passReqToCallback: true
//   },
//   (req, username, password, done) => {
//     console.log("frigging");
//     // return done(null, false, {message: "damn"});
//     // req.session['happy'] = "True";
//     connectionManager.get().getRepository(Author)
//       .createQueryBuilder("author")
//       .where("author.firstName = :name", {name: username})
//       .getOne().then(a => {
//       done(null, a)
//     });
//
//   })
// );


// graphQLServer.post('/login', passport.authenticate('local', {
//   successRedirect: '/graphiql',
//   failureRedirect: '/login',
//   failureFlash: true
// }));

// graphQLServer.post('/login', (req, res, next) => {
//   console.log("what");
//     passport.authenticate('local', (err, user, info) => {
//       console.log(err);
//       console.log(user);
//       console.log(info);
//       console.log("session", req.session);
//     })(req, res, next);
// });
//
//
// graphQLServer.post('/lupi',(req, res, next) => {
//
//   console.log("user: ", req.cookies);
// }
// );

interface decodedToken {
  username: string;
  password: string;
  iat: number;
  exp: number;
}

graphQLServer.post('/login', (req: Request, res: Response) => {
  let username = req.body.username;
  let password = req.body.password;

  let expiresAt = Date.now() + (1000 * 60 * 60);
  let token = jwt.sign(
    {username: username,
      password: password},
    'cat_litter',
    { expiresIn: '1h'}
  );
  res.send({token: token, expiresAt: expiresAt})
});

graphQLServer.post('/graphql', (req: Request, res: Response, next) => {
  // next();
  // graphql(schema(), req.body, { user: {firstName: "roger"} })
  //   .then((data) => {
  //   console.log("data? ", data);
  //     res.send(JSON.stringify(data));
  //   });

  let token = req.headers['authorization'];
  if (isNullOrUndefined(token) || token == "null") {
    next();
  } else {
  let decode: decodedToken = jwt.decode(token);
  connectionManager.get()
    .getRepository(Author)
    .createQueryBuilder('author')
    .where("author.firstName ILIKE :name", {name: decode.username})
    .getOne().then(u => {
    console.log("we got teh following decoding", u);
    req.user = u;
    next()
  })
  }
});


// graphQLServer.use(bodyParser.urlencoded({ extended: true }) );

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress(request => {
  console.log("we got request");
  return {
    schema: schema(),
    context: {user: request.user},
  }
}));



//
// graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
//   schema: schema(),
//   context: {},
// }));


graphQLServer.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));


graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));








