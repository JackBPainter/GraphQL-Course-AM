import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'

// Scaler types - String, Boolean, Int (whole numbers), Float (numbers with decimal points, ID) 

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        User,
        Comment,
        Post,
    },
    context: {
        db
    }
})

server.start(() => {
    console.log('Server is up')
})