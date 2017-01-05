import * as Sequelize from 'sequelize';
import * as _ from 'lodash';
import {Chance} from 'chance'

let chance = new Chance();
export interface Post {
    id?: string;
    title?: string;
    text?: string;
    tags?: string;
}

export interface Author {
    id?: string;
    firstName?: string;
    lastName?: string;
    createPost?: (post: Post) => Promise<Post>;
}


export interface AuthorInstance extends Sequelize.Instance<Author>, Author {
}

export interface PostInstance extends Sequelize.Instance<Post>, Post {}

const db = new Sequelize('blog', null, null, {
    dialect: 'sqlite',
    storage: './blog.sqlite'
});

const AuthorModel = db.define<AuthorInstance, Author>('author', {
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
});

const PostModel = db.define<PostInstance, Post>('post', {
    title: {
        type: Sequelize.STRING,
    },
    text: {
        type: Sequelize.STRING,
    },
    tags: {
        type: Sequelize.STRING,
    }
});

// Relations
AuthorModel.hasMany(PostModel);
PostModel.belongsTo(AuthorModel);

db.sync({force: true}).then(() => {

    _.times(10, () => {
        return AuthorModel.create({
            firstName: chance.first(),
            lastName: chance.last()
        }).then((author: Author) => {
            return author.createPost({
                title: `A post by ${author.firstName} ${author.lastName}`,
                text: chance.paragraph(),
                tags: chance.word(),
            }).then((post: Post) => {
                return post;
            })
        })
    });

});

export const Author = AuthorModel;
export const Post = PostModel;

