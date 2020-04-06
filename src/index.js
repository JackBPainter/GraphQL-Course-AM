import { GraphQLServer } from 'graphql-yoga'

// Type Defintion = Schema
const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`

// Resolvers
const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!'
        },
        name() {
            return 'Jack Painter'
        },
        location() {
            return 'London'
        },
        bio() {
            return 'I am a Jnr React Developer'
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