const { ApolloServer } = require('apollo-server-lambda')
const { InMemoryCache } = require('apollo-cache-inmemory')
const resolvers = require('./resolvers')
const typeDefs = require('./schema')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event, context }) => {
    const headers = {}
    Object.keys(event.headers).forEach(key => {
      headers[key.toLowerCase()] = event.headers[key]
    })

    return {
      headers,
      ...context
    }
  },
  cache: new InMemoryCache()
})

module.exports = server.createHandler({
  cors: {
    origin: '*',
    credentials: true
  }
})
