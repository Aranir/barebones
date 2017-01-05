import {Author, Post,} from './connectors';
import {Chance} from 'chance'

const chance = new Chance();


const resolvers = {
    Query: {
        authors() {
            return Author.findAll();
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
                return Author.findOne();
            } else {
                return Author.find({where});
            }
        },
    },
    Mutation: {
        createAuthor: (root, {firstName, lastName}) => {
            console.log("We had something", firstName);
            return Author.create({
                firstName: firstName,
                lastName: lastName
            });
        },
        createPost: (root, {authorId, tags, title, text}) => {
            return Author.findOne({where: {id: authorId}}).then((author) => {
                console.log('found', author);
                return author.createPost({tags: tags.join(','), title, text});
            });
        },

    },

    Author: {
        posts(author){
            return author.getPosts();
        },
    },
    Post: {
        author(post){
            return post.getAuthor();
        },
        tags(post){
            return post.tags.split(',');
        },
    }
};

export default resolvers;