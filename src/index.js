import { GraphQLServer } from 'graphql-yoga'

// Scaler types - String, Boolean, Int (whole numbers), Float (numbers with decimal points, ID) 

// Demo user data
const comments = [{
    id: '101',
    text: 'This is comment one',
    author: '3',
    post: '10'
}, {
    id: '102',
    text: 'This is comment two',
    author: '3',
    post: '12'
}, {
    id: '103',
    text: 'This is comment three',
    author: '2',
    post: '11'
}, {
    id: '104',
    text: 'This is comment four',
    author: '1',
    post: '10'
}]

const users = [{
    id: '1',
    name: 'Jess',
    email: 'Jess@gmail.com',
    age: 32
}, {
    id: '2',
    name: 'Mark',
    email: 'Mark@yahoo.com',
    age: 24
}, {
    id: '3', 
    name: 'Barnett',
    email: 'Barnett@aol.com',
    age: 27
}]

const posts = [{
    id: '10',
    title: 'First World War',
    body: 'The first of two world wars',
    published: true,
    author: '1'
}, {
    id: '11',
    title: 'Second World War',
    body: 'The second of two world wars',
    published: true,
    author: '1'
}, {
    id: '12',
    title: 'Coronavirus',
    body: 'The war against people who are too stupid / ignorant to listen to government instructions',
    published: true,
    author: '2'
}]

// Type Defintion = Schema
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => {
                return post.body.toLowerCase().includes(args.query.toLowerCase()) || 
                    post.title.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        me() {
            return {
                id: 78868,
                name: 'John Doe',
                email: 'john@gmail.com',
                age: 45
            }        
        },
        post() {
            return {
                id: 1,
                title: 'My first blog post',
                body: 'This is my first blog post',
                published: true
            }
        },
        comments(parent, args, ctx, info) {
            return comments
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.post === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.filter((user) => {
                return user.id === parent.id
            })
        },
        post(parent, args, ctx, info) {
            return posts.find(post => {
                return post.id === parent.post
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.author === parent.id
            })
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('Server is up')
})