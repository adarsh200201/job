const mongoose = require('mongoose');

const dsaQuestionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    index: true
  }, // 'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs', 'Recursion', 'Dynamic Programming', 'Greedy Algorithms'
  title: {
    type: String,
    required: true,
    unique: true
  },
  problemStatement: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
    index: true
  },
  solutionCode: {
    type: String,
    required: true
  }, // Reference solution code (e.g. JavaScript/C++/Java snippet)
  solutionCodeCpp: {
    type: String
  },
  solutionCodeJava: {
    type: String
  },
  solutionCodePython: {
    type: String
  },
  explanation: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DSAQuestion', dsaQuestionSchema);
