class AnswerError extends Error {}

class Answer {
  constructor(text, label, selectedCount) {
    this.text = text
    this.label = label
    this.selectedCount = selectedCount
  }

  toObject() {
    return {
      text: this.text,
      label: this.label,
      selectedCount: this.selectedCount
    }
  }
}

class AnswerCollection {
  constructor(answers) {
    this.answers = []
    for (let i = 0; i < answers.length; i++) {
      this.push(answers[i])
    }
  }

  push(value) {
    if (value instanceof Answer) {
      this.answers.push(value)
    }
    throw new AnswerError(`Value must be an instace of 'Answer'`)
  }

  [Symbol.iterator]() {
    return this.answers
  }
}

module.exports = {
  Answer,
  AnswerCollection
}
