import { GraphQLServer } from 'graphql-yoga'

// Scaler types - String, Boolean, Int (whole numbers), Float (numbers with decimal points, ID) 

// Type Defintion = Schema
const typeDefs = `
    type Query {
        greeting(name: String): String!
        add(num1: Float!, num2: Float!): Float!
        post: Post!
        me: User!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
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
        greeting(parents, args) {
            if (args.name) {
                return `Hello ${args.name}!`
            } else {
                return 'Hello!'
            }
        },  
        add(parents, args) {
            return args.num1 + args.num2
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