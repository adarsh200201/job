const mongoose = require('mongoose');

const govPrepSchema = new mongoose.Schema({
  exam: {
    type: String,
    required: true,
    index: true
  }, // 'SSC', 'Banking', 'Railway', 'UPSC', 'GPSC', 'State Exams'
  category: {
    type: String,
    enum: ['Aptitude', 'Reasoning', 'English', 'Previous Papers'],
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true
  },
  options: [String],
  answer: {
    type: String,
    required: true
  },
  explanation: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GovPrep', govPrepSchema);
