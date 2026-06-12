const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Aptitude', 'Technical', 'Placement', 'Government'],
    required: true,
    index: true
  },
  duration: {
    type: Number,
    required: true
  }, // duration in minutes (15, 30, 60)
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    answer: {
      type: String,
      required: true
    },
    explanation: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('MockTest', mockTestSchema);
