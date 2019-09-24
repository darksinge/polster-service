const dynamoose = require('dynamoose')
const uuid = require('uuid').v4
const Question = require('./question')

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

const PollModel = dynamoose.model('PollTable', schema)

class Poll {
  constructor(title, id = null) {
    this.title = title
    this.id = id || uuid()
    this.questionId = this.id
    this.questions = []
  }

  static async query(id) {
    const result = await PollModel.query('id')
      .eq(id)
      .exec()

    const [rawPoll] = result.filter(v => v.id === v.questionId)
    const rawQuestions = result.filter(v => v.id !== v.questionId)

    const poll = new Poll(rawPoll.name, rawPoll.id)
    for (let i = 0; i < rawQuestions.length; i++) {
      const q = rawQuestions[i]
      const question = new Question(q.name)
      for (let n = 0; n < q.answers.length; n++) {
        const ans = q.answers[n]
        question.addAnswer(ans.text, ans.label, ans.selectedCount)
      }
      poll.questions.push(question)
    }
    return poll
  }
}

module.exports = Poll
