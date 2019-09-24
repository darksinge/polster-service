// https://www.npmjs.com/package/merge-graphql-schemas
const { mergeResolvers } = require('merge-graphql-schemas')
const pollResolvers = require('./poll-resolvers')

// prettier-ignore
const resolvers = [
  pollResolvers
]

module.exports = mergeResolvers(resolvers)
