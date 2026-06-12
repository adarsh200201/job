const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  solvedQuestions: [{
    questionId: { type: String, required: true },
    category: { type: String, required: true }, // 'Aptitude', 'Technical', 'DSA', 'Company', 'Government'
    topic: { type: String, required: true }, // e.g. 'Percentage', 'React', 'Arrays'
    isCorrect: { type: Boolean, default: true },
    solvedAt: { type: Date, default: Date.now }
  }],
  completedTopics: [{
    topic: { type: String, required: true },
    category: { type: String, required: true },
    completedAt: { type: Date, default: Date.now }
  }],
  testHistory: [{
    testId: { type: String, required: true },
    testTitle: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    durationTaken: { type: Number, required: true }, // in seconds
    attemptedAt: { type: Date, default: Date.now }
  }],
  xp: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String
  }], // 'Aptitude Master', 'DSA Beginner', 'Interview Expert', 'Mock Test Champion'
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
