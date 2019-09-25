const { PollModel } = require('./poll-model')
const { Answer, AnswerCollection } = require('./answer')

const alphabet = [...'abcdefghijklmnopqrstuvwxyz'.toUpperCase()]

class QuestionError extends Error {}

const requiredArg = (name, defaultValue) => {
  if (!defaultValue) {
    throw new QuestionError(`${name} parameter is required`)
  }
  return defaultValue
}

class Question {
  constructor(questionText, pollId, isTF = false) {
    this.questionText = questionText
    this.questionId = null
    this.answers = new AnswerCollection()
    this.pollId = pollId
    this.isTF = isTF
  }

  addLabels(type = 'alphabet') {
    function getLabels(type, count) {
      switch (type) {
        case 'alphabet': {
          return alphabet.slice(0, count)
        }
        case 'numeric': {
          return Array(count)
            .fill()
            .map((_, i) => i.toString())
        }
        default:
          throw new QuestionError(`type '${type}' is not a valid label type`)
      }
    }

    const labels = getLabels(type, this.answers.length)
    for (let i = 0; i < this.answers.length; i++) {
      const answer = this.answers[i]
      if (!answer.label) {
        answers.label = labels.pop()
      }
    }
  }

  createTransaction(
    pollId = requiredArg('pollId', this.pollId),
    questionId = requiredArg('questionId', this.questionId)
  ) {
    return PollModel.transaction.create({
      id: pollId ? pollId : this.pollId,
      questionId: questionId ? questionId : this.questionId,
      name: this.questionText,
      answers: this.answers.map(answer => answer.toObject())
    })
  }

  addAnswer(text, label, selectedCount) {
    this.answers.push(new Answer(text, label, selectedCount))
  }
}

module.exports.Question = Question
