import { GraphQLServer } from 'graphql-yoga'

// Scaler types - String, Boolean, Int (whole numbers), Float (numbers with decimal points, ID) 

// Type Defintion = Schema
const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int!
        rating: Float
        inStock: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        title() {
            return 'Room fan'
        },
        price() {
            return 19.99
        },
        releaseYear() {
            return 2004
        },
        rating() {
            return 4.5
        },
        inStock() {
            return true
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