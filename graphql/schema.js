const { gql } = require('apollo-server-lambda')

module.exports = gql`
  type Poll {
    id: ID
    title: String
    questions: [Question]
  }

  type Question {
    id: ID
    text: String
    isTF: Boolean
    answers: [Answer]
  }

  type Answer {
    text: String
    label: String
    selectedCount: Int
  }
`
