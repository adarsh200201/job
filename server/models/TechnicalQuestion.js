const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    index: true
  }, // 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Java', 'Python', 'DBMS', 'Operating System', etc.
  type: {
    type: String,
    enum: ['MCQ', 'Interview'],
    default: 'MCQ',
    index: true
  },
  question: {
    type: String,
    required: true
  },
  options: [String], // Empty array if type is 'Interview'
  answer: {
    type: String,
    required: true
  }, // Correct option string (for MCQ) or sample answer / talking points (for Interview)
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

module.exports = mongoose.model('TechnicalQuestion', technicalQuestionSchema);
