const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('').map(c => c.toUpperCase())

class QuestionError extends Error {}

class QuestionValidator {
  static answerLength(answers) {
    if (answers.length > alphabet.length) {
      throw new QuestionError(
        `Too many answers: questions can have up to ${alphabet.length} answers.`
      )
    }
  }
}

class Question {
  constructor(question, answers, isTF = false) {
    this.name = question
    this.questionId = null
    this.answers = answers || []
    this.isTF = isTF

    this._validate()
  }

  _validate() {
    QuestionValidator.answerLength(this.answers)
  }

  addAnswer(text, label, selectedCount = 0) {
    this.answers.push({
      text,
      label,
      selectedCount
    })

    QuestionValidator.answerLength(this.answers)
  }

  addLabels(type = 'alphabet') {
    switch (type) {
      case 'alphabet': {
        for (let i = 0; i < answers.length; i++) {
          answers[i].label = alphabet[i]
        }
      }
      case 'numeric': {
        for (let i = 0; i < answers.length; i++) {
          answers[i].label = `${i}.`
        }
      }
      default:
        throw new QuestionError(`type '${type}' is not a valid label type`)
    }
  }
}

module.exports = Question
