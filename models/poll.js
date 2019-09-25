const dynamoose = require('dynamoose')
const { PollModel } = require('./poll-model')
const Question = require('./question')

class Poll {
  constructor(title, id = null) {
    this.title = title
    this.id = id || uuid()
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

  async create() {
    const questionTransactions = this.questions.map((question, index) => {
      question.addLabels()
      return question.createTransaction(this.id, index.toString())
    })

    await dynamoose.transaction([
      PollModel.transaction.create({
        id: this.id,
        questionId: this.id,
        name: this.title
      }),
      ...questionTransactions
    ])
  }
}

module.exports.Poll = Poll
