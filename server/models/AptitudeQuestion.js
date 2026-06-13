const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    index: true
  }, // 'Aptitude', 'Reasoning', 'Verbal Ability', 'Technical', 'DSA', 'Company Wise', etc.
  topic: {
    type: String,
    index: true
  }, // 'Percentage', 'Profit & Loss', 'Time & Work', etc. (Keep for backward compatibility)
  subCategory: {
    type: String,
    index: true
  }, // Same as topic, satisfies new requirements
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  answer: {
    type: String
  }, // Correct answer (Keep for backward compatibility)
  correctAnswer: {
    type: String
  }, // Same as answer, satisfies new requirements
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
    index: true
  },
  company: {
    type: String,
    index: true,
    default: ''
  },
  marks: {
    type: Number,
    default: 1
  },
  negativeMarks: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true
  }
}, {
  timestamps: true
});

// Compound index for duplicate prevention
aptitudeQuestionSchema.index({ question: 1, category: 1, subCategory: 1 });
aptitudeQuestionSchema.index({ createdAt: -1 });

// Pre-save hook to keep topic/subCategory and answer/correctAnswer synchronized
aptitudeQuestionSchema.pre('save', function(next) {
  if (this.subCategory && !this.topic) {
    this.topic = this.subCategory;
  } else if (this.topic && !this.subCategory) {
    this.subCategory = this.topic;
  }
  if (this.correctAnswer && !this.answer) {
    this.answer = this.correctAnswer;
  } else if (this.answer && !this.correctAnswer) {
    this.correctAnswer = this.answer;
  }
  next();
});

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);

