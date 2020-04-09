import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Scaler types - String, Boolean, Int (whole numbers), Float (numbers with decimal points, ID) 

// Demo user data
let comments = [{
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

let users = [{
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

let posts = [{
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

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!,
        body: String!,
        published: Boolean!,
        author: ID!
    }

    input CreateCommentInput {
        text: String!, 
        author: ID!, 
        post: ID!
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.data.email)

            if(emailTaken) {
                throw new Error('Email already in use!')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }
            
            users.push(user)

            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user => user.id === args.id)

            if(userIndex === -1) {
                throw new Error('No user found')
            }

            const deletedUsers = users.splice(userIndex, 1)

            posts = posts.filter(post => {
                const match = post.author === args.id

                if (match) {
                    comments = comments.filter(comment =>  comment.post !== post.id)
                }

                return !match
            })
            comments = comments.filter(comment => comment.author !== args.id)

            return deletedUsers[0]
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)

            if(!userExists) {
                throw new Error('User not found')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex(post => post.id === args.id)

            if (postIndex === -1) {
                throw new Error('Post not found')
            }

            const deletedPosts = posts.splice(postIndex, 1)

            comments = comments.filter(comment => comment.post !== args.id)

            return deletedPosts[0]
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)
            const postExists = posts.some(post => post.id === args.data.post && post.published)

            if(!userExists) {
                throw new Error('User not found')
            }

            if(!postExists) {
                throw new Error('Post not found')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }
            
            comments.push(comment)

            return comment
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex(comment => comment.id === args.id)

            if(commentIndex === -1) {
                throw new Error('Comment not found')
            }

            const deletedComments = comments.splice(commentIndex, 1)

            return deletedComments[0]
            
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
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
                return post.author === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => {
                return comment.author === parent.id
            })
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
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('Server is up')
})