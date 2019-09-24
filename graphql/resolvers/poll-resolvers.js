const { Poll } = require('../../models')

module.exports = {
  Query: {
    poll: async (_, { id }) => await Poll.query(id)
  },
  Mutation: {
    //
  }
}
