import { GraphQLServer } from 'graphql-yoga'

// Scaler types - String, Boolean, Int (whole numbers), Float (numbers with decimal points, ID) 

// Type Defintion = Schema
const typeDefs = `
    type Query {
        post: Post!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        post() {
            return {
                id: 1,
                title: 'My first blog post',
                body: 'This is my first blog post',
                published: true
            }
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