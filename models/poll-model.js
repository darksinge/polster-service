const dynamoose = require('dynamoose')
const uuid = require('uuid').v4

// const AWS = require('aws-sdk')
// const ENDPOINT = 'http://localhost:8000'
// const credentials = new AWS.Credentials('akid', 'secret', 'session')
// const ddb = new AWS.DynamoDB({
//   credentials,
//   region: 'us-east-2',
//   endpoint: ENDPOINT
// })
//
// dynamoose.local(ENDPOINT)
// dynamoose.setDefaults({
//   create: true,
//   waitForActive: true
// })
//
// dynamoose.setDDB(ddb)

const schema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: () => uuid()
  },
  questionId: {
    type: String,
    rangeKey: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  answers: {
    type: 'list',
    list: [
      {
        type: 'map',
        map: {
          text: String,
          label: String,
          selectedCount: Number
        }
      }
    ]
  },
  isTF: {
    type: Boolean,
    default: false
  }
})

schema.statics.getQuestionsByPollId = async function(id) {
  const poll = await this.query('id')
    .eq(id)
    .exec()
  const questions = poll.filter(({ id, questionId }) => id !== questionId)
  return questions
}

module.exports.PollModel = dynamoose.model('PollTable', schema)
