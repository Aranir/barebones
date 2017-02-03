import {Chance} from 'chance'
import {Connection} from "typeorm";
import {Author} from "../entities/Author";
import {Post} from "../entities/Post";

const chance = new Chance();


export function resolvers(connection: Connection) {
  return {
    Query: {
      authors() {
        return connection.getRepository(Author).find();
      },
      author(root, {firstName, lastName}){
        let where: {firstName?: string, lastName?: string};
        if (!lastName) {
          where = {firstName};
        }
        if (!firstName) {
          where = {lastName};
        }

        if (!firstName && !lastName) {
          return connection.getRepository(Author).findOne();
        } else if (!lastName) {
          return connection.getRepository(Author)
            .createQueryBuilder("author")
            .where("author.firstName = :firstName", {firstName: firstName})
            .getOne();
        } else if (!firstName) {
          return connection.getRepository(Author)
            .createQueryBuilder("author")
            .where("author.lastName = :lastName", {lastName: lastName})
            .getOne();
        } else {
          return connection.getRepository(Author)
            .createQueryBuilder("author")
            .where("author.firstName = :firstName", {firstName: firstName})
            .andWhere("author.lastName = :lastName", {lastName: lastName})
            .getOne();
        }
      },
      posts() {
        return connection.getRepository(Post)
          .createQueryBuilder("post")
          .orderBy("post.id").getMany();
      }
    },
    Mutation: {
      createAuthor: (root, {firstName, lastName}) => {
        let author = new Author();
        author.firstName = firstName;
        author.lastName = lastName;

        return connection.getRepository(Author).persist(author);
      },
      createPost: (root, {authorId, tags, title, text}) => {

        return connection.getRepository(Author).findOneById(authorId).then(author => {
          let post = new Post();
          post.author = author;
          post.title = title;
          post.text = text;
          post.tags = tags.join(',');
          return connection.getRepository(Post).persist(post);

        })
      }

    },

    Author: {
      posts(author: Author){
        return connection.getRepository(Post).createQueryBuilder("post")
          .innerJoin("post.author", "author")
          .where("author.id = :id", {id: author.id})
          .getMany()
      },
    },
    Post: {
      author(post: Post){
        return connection.getRepository(Author).createQueryBuilder("author")
          .innerJoin("author.posts", "post")
          .where("post.id = :id", {id: post.id})
          .getOne()

      },
      tags(post: Post){
        return post.tags.split(',');
      },
    }
  }
}

